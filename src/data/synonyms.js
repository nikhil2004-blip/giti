'use strict';

/**
 * Synonym expansion table.
 * Maps every word in a cluster → canonical term.
 * The matcher normalises query tokens through this table before scoring.
 *
 * DESIGN PRINCIPLE: canonicals are the exact tokens that appear in intent phrases.
 * Every colloquial, slang, or alternative phrasing maps to one canonical form.
 * Canonical terms should NOT themselves be synonyms for each other to prevent
 * false cross-intent collisions.
 */
const SYNONYM_MAP = buildMap({
  // ── Action verbs ──────────────────────────────────────────────────────
  undo:        ['revert','rollback','reverse','cancel','uncommit','unpush','unfuck',
                'undelete','unsave','undone','revoke','void','invalidate','back out',
                'roll back','take back','walk back','unwind','nuke'],
  unstage:     ['unadd','untrack staged','dequeue','un-add','un-stage','destage',
                'remove from staging','remove from stage','take out of staging',
                'remove added','remove staged','unselect','deselect staged'],
  discard:     ['throw away','throw out','toss','scrap','abandon','chuck','kill changes',
                'lose changes','junk','bin','trash changes','drop changes','ditch','erase changes'],
  remove:      ['delete','rm','erase','drop','kill','eliminate','destroy','get rid',
                'clear','wipe','detach','deinit','unlink','deregister'],
  add:         ['include','put','insert','attach','append','queue'],
  stage:       ['track','index','mark ready','prepare commit'],
  show:        ['see','display','view','list','print','check','look','inspect',
                'peek','examine','dump','output','reveal','read','open'],
  create:      ['make','new','init','start','setup','initialize','begin','open','build',
                'set up','set-up','generate','produce','spin up'],
  rename:      ['mv','change name','update name','relabel','rebrand','give new name'],
  save:        ['shelve','put aside','park','hold','preserve','stow','tuck away'],
  switch:      ['change','go to','checkout','jump to','move to','navigate','use',
                'go over to','swap to','swap branch','hop to','hop branch'],
  update:      ['sync','refresh','get latest','upgrade','apply','bring up to date',
                'catch up','modernize'],
  push:        ['upload','send','publish','deploy','push up','submit','ship'],
  fetch:       ['download', 'retrieve', 'get remote', 'grab remote'],
  pull:        ['receive','sync remote','get changes'],
  fix:         ['repair','amend','correct','edit','patch','tweak','adjust',
                'touch up','clean up','rectify','mend'],
  merge:       ['combine','join','integrate','incorporate','fold','bring together',
                'fuse','unite'],
  copy:        ['cherry-pick','cherrypick','duplicate','port','bring','take','grab commit',
                'port commit','transplant','pick commit'],
  squash:      ['collapse','flatten','consolidate','compress commits',
                'combine commits','join commits','fold commits'],
  compare:     ['diff','difference','vs','versus','between','contrast','delta',
                'check difference','what changed'],
  find:        ['search','look for','locate','grep','discover','hunt','scan','query',
                'seek','search for','filter'],
  ignore:      ['skip','exclude','hide','gitignore','blacklist','block'],
  recover:     ['restore','get back','bring back','undelete','rescue','retrieve lost'],
  clone:       ['duplicate repo','copy repo','mirror repo'],
  log:         ['history','past','timeline','changelog','commits','audit trail',
                'track record','commit list'],
  blame:       ['annotate','who changed','who wrote','who edited','line author',
                'who is responsible','who touched','who modified','who did this'],
  stash:       ['shelf','wip','save work','park work','temp save','temporary save',
                'saved changes','hold changes','put work aside'],
  conflict:    ['clash','problem','overlap','fight','battle','merge problem',
                'merge issue','collision'],
  rebase:      ['replay','move commits','restructure commits','linearize','clean history'],
  tag:         ['release','label','mark','version','flag','stamp','bookmark',
                'milestone','mark version'],
  config:      ['configure','settings','setup','preferences','options','configuration'],
  branch:      ['feature','br','stream','line','dev branch','pr','pull request'],
  commit:      ['revision','snapshot','save point','checkpoint','changeset'],
  repository:  ['repo','project','codebase','directory','folder','workspace','codebase'],

  // ── Adjectives / state descriptors ────────────────────────────────────
  staged:      ['added','indexed','cached','queued','in staging','ready to commit',
                'tracked','marked ready','selected'],
  unstaged:    ['untracked','uncommitted','working tree','not staged','not added'],
  latest:      ['recent','newest','current','fresh','new','last','head'],
  remote:      ['origin','upstream','server','cloud','github','gitlab','bitbucket',
                'heroku','hosted'],
  local:       ['my machine','offline','on disk','here'],
  all:         ['everything','entire','whole','complete','every','globally'],
  specific:    ['particular','certain','given','exact','one'],
  previous:    ['prior','last','former','old','past','earlier','before'],
  partial:     ['part','chunk','hunk','piece','section','portion','some'],
  annotated:   ['signed','full','detailed','verbose','heavy'],
});

function buildMap(groups) {
  const map = {};
  for (const [canonical, synonyms] of Object.entries(groups)) {
    map[canonical] = canonical; // canonical maps to itself
    for (const s of synonyms) map[s] = canonical;
  }
  return map;
}

/**
 * Stop-words to strip before matching.
 * These carry no signal for intent discrimination.
 */
const STOP_WORDS = new Set([
  // Articles & determiners
  'i','me','my','we','our','you','your','the','a','an',
  'this','these','those','that','its','their','his','her',
  // Auxiliary & modal verbs
  'is','it','be','been','have','has','had','do','does','did',
  'will','would','can','could','should','may','might','shall','must',
  'am','are','was','were','being',
  // Contractions (expanded)
  'ain','arent','cant','couldnt','didnt','doesnt','dont','hadnt',
  'hasnt','havent','isnt','wasnt','werent','wont','wouldnt','shouldnt',
  // Prepositions & conjunctions
  'to','of','for','in','on','at','by','from','with','about','into',
  'through','during','after','before','above','below','up','down',
  'out','off','over','under','again','then','once','after','since',
  'and','or','but','nor','so','yet','both','either','neither','not',
  'no','nor',
  // Question words
  'how','what','when','where','who','which','why','whose','whom',
  // Common filler words
  'just','also','some','any','all','both','each','few','more','most',
  'other','another','than','too','very','s','t','re','d','ll','ve',
  'm','even','still','already','always','never','often','usually',
  'really','actually','basically','literally','only','simply',
  // User-request filler
  'want','need','like','please','help','tell','make','let','try',
  'show','get','give','use','using','used','know','knowing',
  'can','cannot','quickly','fast','easy','easily','properly',
  // Git-specific noise
  'git','command','cmd','run','execute','type','do','perform',
  // Common short words
  'go','now','here','there','way','case','time','thing','things',
]);

/**
 * QWERTY keyboard adjacency map.
 * Used for keyboard-aware typo tolerance in the Levenshtein scorer.
 */
const ADJACENCY = {
  q:['w','a','s'],        w:['q','e','a','s','d'],
  e:['w','r','s','d','f'],r:['e','t','d','f','g'],
  t:['r','y','f','g','h'],y:['t','u','g','h','j'],
  u:['y','i','h','j','k'],i:['u','o','j','k','l'],
  o:['i','p','k','l'],    p:['o','l'],
  a:['q','w','s','z'],    s:['a','w','e','d','z','x'],
  d:['s','e','r','f','x','c'],f:['d','r','t','g','c','v'],
  g:['f','t','y','h','v','b'],h:['g','y','u','j','b','n'],
  j:['h','u','i','k','n','m'],k:['j','i','o','l','m'],
  l:['k','o','p'],        z:['a','s','x'],
  x:['z','s','d','c'],    c:['x','d','f','v'],
  v:['c','f','g','b'],    b:['v','g','h','n'],
  n:['b','h','j','m'],    m:['n','j','k'],
};

module.exports = { SYNONYM_MAP, STOP_WORDS, ADJACENCY };
