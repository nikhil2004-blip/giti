'use strict';

/**
 * Complete intent taxonomy for giti.
 * COVERAGE PRINCIPLE: Every intent has 10–20+ natural-language phrases covering:
 *   - Direct verb forms   ("unstage file", "remove from staging")
 *   - Slang / colloquial ("un-add", "take out of index")
 *   - Past-tense undos   ("accidentally added file", "added wrong file")
 *   - Question forms     ("how do I unstage", "what command unstages")
 *   - Error descriptions ("file still shows as staged")
 *   - Typo-prone spellings are covered by Levenshtein, not duplicated here.
 */

const INTENTS = [

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 1 — Stage & Unstage
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'STAGE_01', category: 'Stage & Unstage',
    human: 'Stage a specific file',
    phrases: [
      'stage file', 'add file', 'track file', 'add specific file', 'stage specific file',
      'add one file', 'stage one file', 'select file for commit', 'queue file',
      'mark file ready', 'prepare file for commit', 'include file in commit',
      'put file in staging', 'add file to index', 'stage single file',
      'track this file', 'add to staging', 'put file in stage',
    ],
    commands: [
      { cmd: 'git add <file>', note: 'Stages the specified file.' },
    ],
  },
  {
    id: 'STAGE_02', category: 'Stage & Unstage',
    human: 'Stage all changes',
    phrases: [
      'stage all', 'add all', 'add everything', 'stage everything', 'track all',
      'add all files', 'stage all files', 'stage all changes', 'add all changes',
      'add entire project', 'stage all modified', 'queue everything', 'add whole project',
      'select all files for commit', 'add all to index', 'stage all modified files',
      'include all files', 'mark everything ready', 'track all changes',
      'stage current directory', 'add current directory',
    ],
    commands: [
      { cmd: 'git add .', note: 'Stages all changes in current directory.' },
      { cmd: 'git add -A', note: 'Stages all changes including deletions.' },
    ],
  },
  {
    id: 'STAGE_03', category: 'Stage & Unstage',
    human: 'Stage parts of a file (patch/interactive)',
    phrases: [
      'stage part', 'add patch', 'stage partial', 'interactive add', 'add chunk',
      'stage chunk', 'add part of file', 'stage hunk', 'add hunk', 'partial add',
      'stage only some changes', 'pick what to stage', 'interactive staging',
      'stage portion', 'add portion of file', 'selectively stage', 'patch mode',
      'choose what to commit', 'stage selected lines', 'add selected changes',
      'pick changes to stage', 'stage piece of file',
    ],
    commands: [
      { cmd: 'git add -p <file>', note: 'Interactively stage hunks of a file.' },
      { cmd: 'git add --patch', note: 'Alias for -p.' },
    ],
  },
  {
    id: 'STAGE_04', category: 'Stage & Unstage',
    human: 'Unstage a specific file',
    phrases: [
      'unstage file', 'remove staged file', 'unadd file', 'unstage specific',
      'remove file from staging', 'undo add file', 'remove add file', 'remove added file',
      'un-add file', 'un-stage file', 'take file out of staging', 'dequeue file',
      'unselect file', 'deselect file', 'remove file from index', 'undo staging file',
      'take back staged file', 'cancel staging file', 'unstage one file',
      'accidentally staged file', 'added wrong file', 'staged wrong file',
      'remove file from stage', 'undo git add file', 'reverse git add',
      'pull file out of staging', 'unmark file', 'untrack staged file',
      'take file out of index', 'keep changes but unstage',
    ],
    commands: [
      { cmd: 'git restore --staged <file>', note: 'Unstages a file without discarding your changes.' },
      { cmd: 'git reset HEAD <file>', note: 'Legacy equivalent (pre-Git 2.23).' },
    ],
  },
  {
    id: 'STAGE_05', category: 'Stage & Unstage',
    human: 'Unstage all staged files',
    phrases: [
      'unstage all', 'remove all staged', 'unadd everything', 'clear staging area',
      'unstage everything', 'remove all from staging', 'unadd all files',
      'clear all staged', 'empty staging area', 'undo all staged', 'un-stage all',
      'reset staging area', 'clear index', 'remove all from index',
      'take everything out of staging', 'dequeue all', 'cancel all staged',
      'undo git add all', 'reverse all staged', 'unstage all changes',
      'accidentally staged everything', 'remove all added files',
    ],
    commands: [
      { cmd: 'git restore --staged .', note: 'Unstages all staged files.' },
      { cmd: 'git reset HEAD', note: 'Legacy equivalent.' },
    ],
  },
  {
    id: 'STAGE_06', category: 'Stage & Unstage',
    human: 'Discard unstaged changes in a file',
    phrases: [
      'discard changes', 'revert file', 'undo changes file', 'throw away changes',
      'discard local changes', 'discard working changes', 'restore file to last commit',
      'undo edits', 'undo modifications', 'revert to saved', 'get original file back',
      'throw away my changes', 'remove local changes', 'clean file', 'reset file',
      'discard uncommitted changes', 'lose my changes', 'go back to last commit state',
      'file back to original', 'discard working tree changes', 'checkout file',
      'undo changes to file', 'revert changes in file', 'remove edits',
      'cancel changes to file', 'file changed accidentally', 'undo file modifications',
    ],
    commands: [
      { cmd: 'git restore <file>', note: 'Discards working-tree changes.' },
      { cmd: 'git checkout -- <file>', note: 'Legacy equivalent.' },
    ],
  },
  {
    id: 'STAGE_07', category: 'Stage & Unstage',
    human: 'See what is staged',
    phrases: [
      'see staged', 'what is staged', 'show staged', 'view staged changes',
      'check what is staged', 'list staged', 'what files are staged',
      'which files are staged', 'staged files list', 'show what will be committed',
      'what is in staging area', 'what is queued', 'see index', 'view index',
      'check staging area', 'staged diff', 'show staged diff', 'what did i stage',
      'what is ready to commit', 'show cached changes', 'diff staged',
      'see what is ready', 'view queued files',
    ],
    commands: [
      { cmd: 'git status', note: 'Shows staged and unstaged changes.' },
      { cmd: 'git diff --cached', note: 'Shows diff of staged changes.' },
    ],
  },
  {
    id: 'STAGE_08', category: 'Stage & Unstage',
    human: 'Stage deleted files',
    phrases: [
      'stage deleted', 'add deleted file', 'track deleted', 'stage removal',
      'stage file deletion', 'add deleted files', 'mark deleted as staged',
      'stage removed file', 'track file deletion', 'commit deletion',
      'include deleted file in stage', 'queue deleted file',
    ],
    commands: [
      { cmd: 'git add -u', note: 'Stages modifications and deletions (not new files).' },
      { cmd: 'git rm <file>', note: 'Removes and stages a specific file.' },
    ],
  },
  {
    id: 'STAGE_09', category: 'Stage & Unstage',
    human: 'Stage a renamed file',
    phrases: [
      'stage renamed', 'add renamed file', 'track rename', 'stage rename',
      'add file after rename', 'track file rename', 'stage moved file',
      'add moved file', 'commit rename', 'stage name change',
    ],
    commands: [
      { cmd: 'git add <newname>', note: 'Git auto-detects the rename; just add the new name.' },
    ],
  },
  {
    id: 'STAGE_10', category: 'Stage & Unstage',
    human: 'Interactive staging session',
    phrases: [
      'interactive staging', 'interactive add session', 'stage interactively',
      'interactive add', 'staging session', 'full interactive stage', 'add -i',
      'open staging menu', 'interactive file picker', 'choose files to stage',
    ],
    commands: [
      { cmd: 'git add -i', note: 'Opens an interactive staging menu.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 2 — Commit
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'COMMIT_01', category: 'Commit',
    human: 'Make a commit',
    phrases: [
      'make commit', 'create commit', 'commit changes', 'save commit', 'commit code',
      'new commit', 'write commit', 'do a commit', 'commit my work', 'save my work',
      'commit with message', 'commit staged changes', 'create new commit',
      'save changes as commit', 'commit to repo', 'record commit',
    ],
    commands: [
      { cmd: 'git commit -m "message"', note: 'Creates a new commit with a message.' },
    ],
  },
  {
    id: 'COMMIT_02', category: 'Commit',
    human: 'Commit all tracked changes without staging',
    phrases: [
      'commit all tracked', 'commit without staging', 'commit tracked changes',
      'quick commit all', 'commit and stage together', 'commit skip staging',
      'commit all modified', 'auto stage and commit', 'commit -am',
      'commit all changes at once', 'commit modified files',
    ],
    commands: [
      { cmd: 'git commit -am "message"', note: 'Stages and commits all tracked changes.' },
    ],
  },
  {
    id: 'COMMIT_03', category: 'Commit',
    human: 'Amend last commit message',
    phrases: [
      'amend commit', 'fix commit message', 'change commit message', 'edit last commit message',
      'update commit message', 'rename last commit', 'amend last commit message',
      'typo in commit message', 'wrong commit message', 'fix typo commit',
      'update last commit message', 'reword commit', 'change last commit message',
      'modify commit message', 'edit commit message', 'correct commit message',
      'fix my commit message', 'amend message', 'update message of last commit',
    ],
    commands: [
      { cmd: 'git commit --amend -m "new message"', note: 'Rewrites the last commit message.' },
    ],
  },
  {
    id: 'COMMIT_04', category: 'Commit',
    human: 'Amend last commit — add more files',
    phrases: [
      'add file to last commit', 'amend commit add file', 'include more files in last commit',
      'forgot to add file', 'add missing file to commit', 'amend with file',
      'include file in last commit', 'add file to previous commit', 'forgot file in commit',
      'missing file in commit', 'amend commit without changing message', 'attach file to commit',
    ],
    commands: [
      { cmd: 'git add <file> && git commit --amend --no-edit', note: 'Adds file to last commit without changing the message.' },
    ],
  },
  {
    id: 'COMMIT_05', category: 'Commit',
    human: 'Create empty commit',
    phrases: [
      'empty commit', 'create empty commit', 'commit nothing', 'trigger ci',
      'commit without changes', 'blank commit', 'dummy commit', 'placeholder commit',
      'force ci run', 'redeploy without changes', 'trigger pipeline', 'kickoff deployment',
    ],
    commands: [
      { cmd: 'git commit --allow-empty -m "message"', note: 'Creates a commit with no file changes.' },
    ],
  },
  {
    id: 'COMMIT_06', category: 'Commit',
    human: 'Sign a commit (GPG)',
    phrases: [
      'sign commit', 'gpg commit', 'signed commit', 'verify commit', 'commit signature',
      'gpg sign', 'sign with gpg', 'cryptographically sign commit', 'verified commit',
      'add signature to commit', 'commit gpg key', 'gpg signing',
    ],
    commands: [
      { cmd: 'git commit -S -m "message"', note: 'Creates a GPG-signed commit.' },
    ],
  },
  {
    id: 'COMMIT_07', category: 'Commit',
    human: 'See last commit message',
    phrases: [
      'see last commit message', 'show last commit message', 'what did i commit',
      'view commit message', 'read commit message', 'what is commit message',
      'print commit message', 'show message of last commit', 'check last commit message',
      'what was my last commit', 'last commit description',
    ],
    commands: [
      { cmd: 'git log -1 --pretty=%B', note: 'Prints just the message of the most recent commit.' },
    ],
  },
  {
    id: 'COMMIT_08', category: 'Commit',
    human: 'Undo last commit — keep changes staged',
    phrases: [
      'undo last commit keep staged', 'soft reset', 'uncommit keep staged',
      'undo commit staged', 'go back one commit keep staged', 'undo commit keep files staged',
      'reset soft', 'reverse commit keep staged', 'unpush commit keep staged',
      'undo commit keep index', 'soft undo commit',
    ],
    commands: [
      { cmd: 'git reset --soft HEAD~1', note: 'Undoes the commit; changes stay staged.' },
    ],
  },
  {
    id: 'COMMIT_09', category: 'Commit',
    human: 'Undo last commit — keep changes unstaged',
    phrases: [
      'undo last commit keep changes', 'mixed reset', 'uncommit keep changes',
      'undo commit unstaged', 'go back one commit', 'messed up last commit', 'fix last commit',
      'undo last commit', 'oops wrong commit', 'take back commit', 'revert last commit',
      'undo my commit', 'uncommit', 'uncommit last', 'remove last commit keep work',
      'delete last commit keep changes', 'undo previous commit', 'reset last commit',
      'go back to before commit', 'before last commit', 'reset mixed',
    ],
    commands: [
      { cmd: 'git reset --mixed HEAD~1', note: 'Undoes the commit; changes stay in working tree.' },
    ],
  },
  {
    id: 'COMMIT_10', category: 'Commit',
    human: 'Undo last commit — discard all changes',
    phrases: [
      'undo last commit discard', 'hard reset', 'nuke last commit', 'completely remove last commit',
      'delete last commit', 'hard undo commit', 'drop last commit', 'destroy last commit',
      'remove commit and changes', 'wipe last commit', 'erase last commit',
      'reset hard last commit', 'discard last commit', 'remove commit permanently',
    ],
    commands: [
      { cmd: 'git reset --hard HEAD~1', note: 'Permanently removes the last commit and all its changes.' },
    ],
  },
  {
    id: 'COMMIT_11', category: 'Commit',
    human: 'Undo multiple commits',
    phrases: [
      'undo multiple commits', 'go back several commits', 'reset multiple commits',
      'undo last n commits', 'remove several commits', 'undo last 3 commits',
      'undo last 5 commits', 'go back n commits', 'reset to earlier commit',
      'roll back multiple commits', 'reverse last several commits',
    ],
    commands: [
      { cmd: 'git reset --soft HEAD~<N>', note: 'Undoes N commits; changes stay staged.' },
    ],
  },
  {
    id: 'COMMIT_12', category: 'Commit',
    human: 'Undo a pushed commit safely',
    phrases: [
      'undo pushed commit', 'revert pushed commit', 'unpush commit', 'safely undo shared commit',
      'revert remote commit', 'reverse committed and pushed', 'undo commit already pushed',
      'create revert commit', 'safe undo commit', 'revert without rewriting history',
      'undo commit on shared branch', 'publicly safe undo', 'revert commit history',
      'undo on main branch', 'git revert commit',
    ],
    commands: [
      { cmd: 'git revert HEAD', note: 'Creates a new "undo" commit — safe for shared branches.' },
    ],
  },
  {
    id: 'COMMIT_13', category: 'Commit',
    human: 'Fix commit author or email',
    phrases: [
      'fix commit author', 'change commit author', 'wrong email in commit', 'fix author name',
      'update commit author', 'wrong author name', 'wrong email commit', 'change author',
      'fix name in commit', 'fix email in commit', 'committed with wrong identity',
      'authored as wrong person', 'fix git author',
    ],
    commands: [
      { cmd: 'git commit --amend --reset-author', note: 'Updates author to current git config identity.' },
    ],
  },
  {
    id: 'COMMIT_14', category: 'Commit',
    human: 'Squash last N commits into one',
    phrases: [
      'squash commits', 'combine commits', 'squash last commits', 'join commits',
      'collapse commits', 'flatten commits', 'squash last 3', 'squash into one',
      'merge commits into one', 'compress commits', 'fold commits', 'consolidate commits',
      'clean up commit history', 'simplify commits', 'squash n commits',
    ],
    commands: [
      { cmd: 'git reset --soft HEAD~N && git commit -m "msg"', note: 'Collapses last N commits into one.' },
    ],
  },
  {
    id: 'COMMIT_15', category: 'Commit',
    human: 'See what last commit changed (diff)',
    phrases: [
      'see last commit changes', 'show last commit diff', 'what changed in last commit',
      'view last commit', 'diff of last commit', 'show recent commit changes',
      'what did last commit do', 'show last commit', 'inspect last commit',
      'what was in last commit', 'last commit diff', 'see commit diff', 'view latest commit',
    ],
    commands: [
      { cmd: 'git show HEAD', note: 'Shows full diff of the last commit.' },
      { cmd: 'git diff HEAD~1 HEAD', note: 'Diff between last two commits.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 3 — Branches
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'BRANCH_01', category: 'Branches',
    human: 'Create new branch',
    phrases: [
      'create branch', 'new branch', 'make branch', 'start branch', 'open branch',
      'add branch', 'create new branch', 'start new branch', 'make new branch',
      'create feature branch', 'create branch from here', 'branch off',
      'start a new branch', 'spin up branch', 'create dev branch', 'start feature',
    ],
    commands: [
      { cmd: 'git checkout -b <name>', note: 'Creates and switches to the new branch.' },
      { cmd: 'git branch <name>', note: 'Creates the branch without switching.' },
    ],
  },
  {
    id: 'BRANCH_02', category: 'Branches',
    human: 'Create branch from specific commit',
    phrases: [
      'branch from commit', 'create branch at commit', 'branch from specific commit',
      'branch at sha', 'start branch at commit', 'create branch from past commit',
      'branch from old commit', 'checkout branch at point',
    ],
    commands: [
      { cmd: 'git checkout -b <name> <commit>', note: 'Creates a branch starting at a specific commit.' },
    ],
  },
  {
    id: 'BRANCH_03', category: 'Branches',
    human: 'Switch to another branch',
    phrases: [
      'switch branch', 'checkout branch', 'change branch', 'go to branch', 'jump to branch',
      'move to branch', 'navigate to branch', 'change to branch', 'swap branch',
      'hop to branch', 'switch to branch', 'go over to branch', 'use another branch',
      'checkout different branch', 'switch to existing branch', 'go to feature branch',
    ],
    commands: [
      { cmd: 'git switch <name>', note: 'Modern way to switch branches.' },
      { cmd: 'git checkout <name>', note: 'Classic equivalent.' },
    ],
  },
  {
    id: 'BRANCH_04', category: 'Branches',
    human: 'Switch to previous branch',
    phrases: [
      'switch back', 'go back branch', 'previous branch', 'last branch', 'return to previous branch',
      'undo branch switch', 'go to last branch', 'back to previous branch',
      'toggle between branches', 'switch to prior branch', 'return to where i was',
    ],
    commands: [
      { cmd: 'git switch -', note: 'Switches to the previously checked-out branch.' },
    ],
  },
  {
    id: 'BRANCH_05', category: 'Branches',
    human: 'List all local branches',
    phrases: [
      'list branches', 'show branches', 'see branches', 'view branches', 'all branches',
      'what branches', 'list all branches', 'show all local branches', 'print branches',
      'display branches', 'see local branches', 'what branch exist', 'branches available',
    ],
    commands: [
      { cmd: 'git branch', note: 'Lists all local branches.' },
    ],
  },
  {
    id: 'BRANCH_06', category: 'Branches',
    human: 'List all remote branches',
    phrases: [
      'list remote branches', 'show remote branches', 'see all remote branches',
      'view remote branches', 'remote branches list', 'show origin branches',
      'which branches on remote', 'all remote branches', 'branches on github',
      'list branches on server', 'remote branch list', 'see all branches remote and local',
    ],
    commands: [
      { cmd: 'git branch -r', note: 'Lists remote-tracking branches.' },
      { cmd: 'git branch -a', note: 'Lists both local and remote branches.' },
    ],
  },
  {
    id: 'BRANCH_07', category: 'Branches',
    human: 'Rename a branch',
    phrases: [
      'rename branch', 'change branch name', 'update branch name', 'move branch',
      'relabel branch', 'give branch new name', 'rename local branch',
      'change name of branch', 'rename feature branch',
    ],
    commands: [
      { cmd: 'git branch -m <old> <new>', note: 'Renames a branch.' },
    ],
  },
  {
    id: 'BRANCH_08', category: 'Branches',
    human: 'Rename current branch',
    phrases: [
      'rename current branch', 'change name of current branch', 'rename this branch',
      'give current branch new name', 'update this branch name', 'rename me',
      'change current branch name',
    ],
    commands: [
      { cmd: 'git branch -m <new>', note: 'Renames the currently checked-out branch.' },
    ],
  },
  {
    id: 'BRANCH_09', category: 'Branches',
    human: 'Delete local branch',
    phrases: [
      'delete branch', 'remove branch', 'delete local branch', 'remove local branch',
      'kill branch', 'drop branch', 'get rid of branch', 'erase branch',
      'destroy local branch', 'remove a feature branch', 'clean up branch',
      'delete merged branch', 'remove old branch',
    ],
    commands: [
      { cmd: 'git branch -d <name>', note: 'Safely deletes branch (only if merged).' },
      { cmd: 'git branch -D <name>', note: 'Force deletes branch.' },
    ],
  },
  {
    id: 'BRANCH_10', category: 'Branches',
    human: 'Delete remote branch',
    phrases: [
      'delete remote branch', 'remove remote branch', 'delete branch on github',
      'delete branch on origin', 'remove branch from remote', 'kill remote branch',
      'drop remote branch', 'push delete branch', 'delete branch remotely',
      'remove branch from server', 'delete branch on gitlab',
    ],
    commands: [
      { cmd: 'git push origin --delete <name>', note: 'Deletes the branch from the remote.' },
    ],
  },
  {
    id: 'BRANCH_11', category: 'Branches',
    human: 'Push branch to remote for first time',
    phrases: [
      'push branch first time', 'publish branch', 'push new branch', 'set upstream',
      'push branch upstream', 'push branch to origin', 'push local branch remote',
      'upload branch', 'push branch for first time', 'share branch remotely',
      'create remote branch', 'make branch available remotely',
    ],
    commands: [
      { cmd: 'git push -u origin <name>', note: 'Pushes branch and sets tracking upstream.' },
    ],
  },
  {
    id: 'BRANCH_12', category: 'Branches',
    human: 'Track a remote branch',
    phrases: [
      'track remote branch', 'set upstream branch', 'link to remote branch',
      'follow remote branch', 'set tracking branch', 'connect local to remote branch',
      'associate branch with remote', 'setup tracking', 'configure upstream',
    ],
    commands: [
      { cmd: 'git branch --set-upstream-to=origin/<name>', note: 'Links local branch to a remote branch.' },
    ],
  },
  {
    id: 'BRANCH_13', category: 'Branches',
    human: 'See which branch I am on',
    phrases: [
      'what branch am i on', 'current branch', 'which branch', 'show current branch',
      'what is my branch', 'which branch am i on', 'current branch name',
      'where am i', 'what branch is active', 'active branch', 'my current branch',
    ],
    commands: [
      { cmd: 'git branch --show-current', note: 'Prints just the current branch name.' },
      { cmd: 'git status', note: 'Shows branch plus file status.' },
    ],
  },
  {
    id: 'BRANCH_14', category: 'Branches',
    human: 'Merge branch into current',
    phrases: [
      'merge branch', 'merge into current', 'combine branches', 'join branch',
      'integrate branch', 'bring branch in', 'merge feature branch', 'merge another branch',
      'incorporate branch', 'fold branch in', 'merge dev into main', 'merge into this branch',
      'merge pr', 'merge pull request', 'how to merge a pr', 'how to merge pull request',
    ],
    commands: [
      { cmd: 'git merge <name>', note: 'Merges the named branch into the current one.' },
    ],
  },
  {
    id: 'BRANCH_15', category: 'Branches',
    human: 'Merge without fast-forward (preserve merge commit)',
    phrases: [
      'merge no fast forward', 'merge no ff', 'preserve merge commit', 'keep merge commit',
      'merge with commit', 'force merge commit', 'explicit merge commit', 'no ff merge',
    ],
    commands: [
      { cmd: 'git merge --no-ff <name>', note: 'Always creates a merge commit.' },
    ],
  },
  {
    id: 'BRANCH_16', category: 'Branches',
    human: 'Squash merge branch into single commit',
    phrases: [
      'squash merge', 'merge squash', 'single commit merge', 'flatten branch merge',
      'squash and merge', 'merge as one commit', 'collapse branch into commit',
      'combine branch commits into one',
    ],
    commands: [
      { cmd: 'git merge --squash <name>', note: 'Squashes branch commits into one.' },
    ],
  },
  {
    id: 'BRANCH_17', category: 'Branches',
    human: 'Abort a merge in progress',
    phrases: [
      'abort merge', 'cancel merge', 'stop merge', 'exit merge', 'quit merge',
      'undo merge in progress', 'back out of merge', 'give up merge',
      'stop merging', 'cancel in-progress merge',
    ],
    commands: [
      { cmd: 'git merge --abort', note: 'Stops a merge and restores pre-merge state.' },
    ],
  },
  {
    id: 'BRANCH_18', category: 'Branches',
    human: 'See branches already merged into main',
    phrases: [
      'merged branches', 'branches merged into main', 'show merged branches',
      'which branches are merged', 'list merged branches', 'branches already in main',
    ],
    commands: [
      { cmd: 'git branch --merged main', note: 'Lists branches already merged into main.' },
    ],
  },
  {
    id: 'BRANCH_19', category: 'Branches',
    human: 'Delete all merged branches',
    phrases: [
      'delete merged branches', 'clean up merged branches', 'remove all merged branches',
      'prune merged branches', 'bulk delete merged', 'clean up old branches',
      'delete all done branches', 'remove finished branches',
    ],
    commands: [
      { cmd: 'git branch --merged | grep -v main | xargs git branch -d', note: 'Bulk deletes merged branches.' },
    ],
  },
  {
    id: 'BRANCH_20', category: 'Branches',
    human: 'Create branch from tag',
    phrases: [
      'branch from tag', 'create branch at tag', 'checkout tag as branch',
      'branch off from release', 'start branch at version', 'branch at tag',
    ],
    commands: [
      { cmd: 'git checkout -b <name> <tag>', note: 'Creates a branch at the commit a tag points to.' },
    ],
  },
  {
    id: 'BRANCH_21', category: 'Branches',
    human: 'Compare two branches',
    phrases: [
      'compare branches', 'diff two branches', 'difference between branches', 'branch vs branch',
      'diff branches', 'changes between branches', 'what is different between branches',
      'compare branch to main', 'compare branch to master', 'changes in branch vs main',
    ],
    commands: [
      { cmd: 'git diff <branch1>..<branch2>', note: 'Shows diff between two branches.' },
    ],
  },
  {
    id: 'BRANCH_22', category: 'Branches',
    human: 'See commits in branch not in main',
    phrases: [
      'commits only in branch', 'commits not in main', 'branch unique commits',
      'branch ahead commits', 'show what branch has extra', 'commits ahead of main',
      'what this branch has that main does not',
    ],
    commands: [
      { cmd: 'git log main..<branch>', note: 'Lists commits in branch not yet in main.' },
      { cmd: 'git log --not main', note: 'Alternative phrasing.' },
    ],
  },
  {
    id: 'BRANCH_23', category: 'Branches',
    human: 'Check out branch to new worktree',
    phrases: [
      'worktree branch', 'add worktree', 'checkout branch as worktree',
      'branch in separate directory', 'check out in parallel',
    ],
    commands: [
      { cmd: 'git worktree add <path> <branch>', note: 'Checks out a branch into a separate directory.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 4 — Remote & Sync
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'REMOTE_01', category: 'Remote & Sync',
    human: 'Clone a repository',
    phrases: [
      'clone repo', 'clone repository', 'download repo', 'get repo', 'grab repo',
      'copy repo', 'clone project', 'download project', 'get project locally',
      'duplicate repo', 'mirror repo', 'clone from github', 'clone from url',
      'download codebase', 'clone codebase',
    ],
    commands: [
      { cmd: 'git clone <url>', note: 'Clones a repository locally.' },
    ],
  },
  {
    id: 'REMOTE_02', category: 'Remote & Sync',
    human: 'Clone specific branch',
    phrases: [
      'clone specific branch', 'clone branch', 'download specific branch',
      'clone only one branch', 'get specific branch from github',
      'clone a feature branch',
    ],
    commands: [
      { cmd: 'git clone -b <branch> <url>', note: 'Clones only a specific branch.' },
    ],
  },
  {
    id: 'REMOTE_03', category: 'Remote & Sync',
    human: 'Clone with depth (shallow clone)',
    phrases: [
      'shallow clone', 'clone shallow', 'clone with depth', 'partial clone',
      'fast clone', 'clone latest only', 'quick clone', 'clone without full history',
      'lightweight clone', 'minimal clone', 'clone last commit only',
    ],
    commands: [
      { cmd: 'git clone --depth 1 <url>', note: 'Clones only the latest snapshot (faster).' },
    ],
  },
  {
    id: 'REMOTE_04', category: 'Remote & Sync',
    human: 'Add a remote',
    phrases: [
      'add remote', 'set remote', 'add origin', 'connect to remote', 'add upstream',
      'link to remote', 'set remote url', 'add github remote', 'configure remote',
      'attach remote', 'link repo to github', 'connect repo to remote',
    ],
    commands: [
      { cmd: 'git remote add origin <url>', note: 'Adds a new remote named "origin".' },
    ],
  },
  {
    id: 'REMOTE_05', category: 'Remote & Sync',
    human: 'Check remote URL',
    phrases: [
      'check remote url', 'see remote url', 'view remote url', 'what is remote',
      'show origin url', 'what remote', 'list remotes', 'show remotes',
      'what is my remote', 'see origin', 'view origin url', 'where is remote',
      'remote address', 'show upstream url',
    ],
    commands: [
      { cmd: 'git remote -v', note: 'Lists all remotes and their URLs.' },
    ],
  },
  {
    id: 'REMOTE_06', category: 'Remote & Sync',
    human: 'Change remote URL',
    phrases: [
      'change remote url', 'update remote url', 'set new remote url', 'fix remote url',
      'update origin', 'update remote address', 'change origin url', 'switch remote url',
      'move repo to new remote', 'update github url', 'rename remote url',
    ],
    commands: [
      { cmd: 'git remote set-url origin <new-url>', note: 'Updates the remote URL.' },
    ],
  },
  {
    id: 'REMOTE_07', category: 'Remote & Sync',
    human: 'Remove a remote',
    phrases: [
      'remove remote', 'delete remote', 'remove origin', 'unlink remote',
      'detach remote', 'drop remote', 'disconnect remote', 'get rid of remote',
      'remove upstream link',
    ],
    commands: [
      { cmd: 'git remote remove <name>', note: 'Removes a remote reference.' },
    ],
  },
  {
    id: 'REMOTE_08', category: 'Remote & Sync',
    human: 'Fetch from remote (no merge)',
    phrases: [
      'fetch remote', 'fetch origin', 'get updates no merge', 'download changes no merge',
      'fetch without merge', 'fetch only', 'just fetch', 'update remote refs',
      'fetch new commits', 'get remote commits', 'sync remote info',
    ],
    commands: [
      { cmd: 'git fetch origin', note: 'Downloads remote changes without merging.' },
    ],
  },
  {
    id: 'REMOTE_09', category: 'Remote & Sync',
    human: 'Fetch from all remotes',
    phrases: [
      'fetch all remotes', 'fetch all', 'get all updates', 'sync all remotes',
      'fetch from everywhere', 'update all remotes', 'download from all remotes',
    ],
    commands: [
      { cmd: 'git fetch --all', note: 'Fetches from all configured remotes.' },
    ],
  },
  {
    id: 'REMOTE_10', category: 'Remote & Sync',
    human: 'Pull latest from remote',
    phrases: [
      'pull latest', 'get latest', 'pull from remote', 'sync latest', 'download latest',
      'pull changes', 'update from remote', 'get new commits', 'sync with remote',
      'update my branch', 'get upstream changes', 'get coworker changes',
      'pull and merge', 'bring in remote changes', 'refresh from remote',
    ],
    commands: [
      { cmd: 'git pull', note: 'Pulls and merges from tracked remote branch.' },
      { cmd: 'git pull origin <branch>', note: 'Pulls from a specific branch.' },
    ],
  },
  {
    id: 'REMOTE_11', category: 'Remote & Sync',
    human: 'Pull with rebase instead of merge',
    phrases: [
      'pull rebase', 'pull with rebase', 'fetch and rebase', 'rebase on pull',
      'update with rebase', 'pull rebase instead of merge', 'pull --rebase',
    ],
    commands: [
      { cmd: 'git pull --rebase', note: 'Replays local commits on top of remote changes.' },
    ],
  },
  {
    id: 'REMOTE_12', category: 'Remote & Sync',
    human: 'Push to remote',
    phrases: [
      'push to remote', 'push changes', 'upload changes', 'send changes', 'publish changes',
      'push code', 'push to github', 'push to origin', 'upload my commits',
      'send commits to remote', 'push commits', 'push to server',
    ],
    commands: [
      { cmd: 'git push', note: 'Pushes to the tracked remote branch.' },
      { cmd: 'git push origin <branch>', note: 'Pushes to a specific remote branch.' },
    ],
  },
  {
    id: 'REMOTE_13', category: 'Remote & Sync',
    human: 'Force push',
    phrases: [
      'force push', 'push force', 'overwrite remote', 'force update remote',
      'push hard', 'force push branch', 'override remote history', 'rewrite remote',
      'push --force', 'push with force', 'push force with lease',
    ],
    commands: [
      { cmd: 'git push --force-with-lease', note: 'Safer force push — fails if remote has new commits.' },
      { cmd: 'git push --force', note: 'Unconditional force push — use with caution.' },
    ],
  },
  {
    id: 'REMOTE_14', category: 'Remote & Sync',
    human: 'Push all branches',
    phrases: [
      'push all branches', 'push everything', 'upload all branches',
      'push all local branches', 'sync all branches', 'push complete project',
    ],
    commands: [
      { cmd: 'git push --all origin', note: 'Pushes all local branches to the remote.' },
    ],
  },
  {
    id: 'REMOTE_15', category: 'Remote & Sync',
    human: 'Push tags to remote',
    phrases: [
      'push tags', 'upload tags', 'send tags to remote', 'publish tags',
      'push all tags', 'share tags', 'push release tags', 'sync tags',
    ],
    commands: [
      { cmd: 'git push --tags', note: 'Pushes all local tags to the remote.' },
    ],
  },
  {
    id: 'REMOTE_16', category: 'Remote & Sync',
    human: 'Sync fork with upstream',
    phrases: [
      'sync fork', 'update fork', 'sync with upstream', 'merge upstream into fork',
      'update from upstream', 'keep fork up to date', 'bring fork up to date',
      'pull from upstream', 'sync forked repo', 'get changes from original repo',
      'fork behind upstream', 'update forked project',
    ],
    commands: [
      { cmd: 'git fetch upstream && git merge upstream/main', note: 'Pulls upstream changes into your fork.' },
    ],
  },
  {
    id: 'REMOTE_17', category: 'Remote & Sync',
    human: 'See remote details',
    phrases: [
      'remote info', 'show remote info', 'remote details', 'inspect remote',
      'check remote details', 'remote information', 'see origin details',
    ],
    commands: [
      { cmd: 'git remote show origin', note: 'Shows detailed info about a remote.' },
    ],
  },
  {
    id: 'REMOTE_18', category: 'Remote & Sync',
    human: 'Prune deleted remote branches locally',
    phrases: [
      'prune remote branches', 'clean up remote branches', 'remove stale remote branches',
      'delete old remote branches', 'prune origin', 'cleanup remote tracking',
      'remove deleted remote branches', 'remove stale tracking branches',
      'prune remote refs', 'clean up origin',
    ],
    commands: [
      { cmd: 'git fetch --prune', note: 'Fetches and removes stale remote-tracking branches.' },
      { cmd: 'git remote prune origin', note: 'Prunes only; no fetch.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 5 — Stash
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'STASH_01', category: 'Stash',
    human: 'Stash current changes',
    phrases: [
      'stash changes', 'save work temporarily', 'put work aside', 'park changes',
      'hold changes', 'shelve work', 'stash work', 'save temporarily',
      'save my changes', 'hold my work', 'put changes aside', 'temp save work',
      'stash my work', 'save wip', 'save work in progress', 'pause work',
      'put my changes on hold', 'save current state', 'store changes temporarily',
    ],
    commands: [
      { cmd: 'git stash', note: 'Stashes all staged and unstaged changes.' },
      { cmd: 'git stash push', note: 'Explicit form with optional flags.' },
    ],
  },
  {
    id: 'STASH_02', category: 'Stash',
    human: 'Stash with a description',
    phrases: [
      'stash with message', 'named stash', 'stash with name', 'label stash',
      'describe stash', 'stash with description', 'stash and name it', 'stash with label',
    ],
    commands: [
      { cmd: 'git stash push -m "description"', note: 'Saves stash with a descriptive label.' },
    ],
  },
  {
    id: 'STASH_03', category: 'Stash',
    human: 'Stash including untracked files',
    phrases: [
      'stash untracked', 'stash new files too', 'stash including untracked',
      'stash all files', 'stash untracked files too', 'include new files in stash',
      'stash everything including new', 'stash with new files',
    ],
    commands: [
      { cmd: 'git stash push -u', note: 'Includes untracked files in the stash.' },
    ],
  },
  {
    id: 'STASH_04', category: 'Stash',
    human: 'Stash only specific files',
    phrases: [
      'stash specific file', 'stash one file', 'stash partial', 'stash selected files',
      'stash certain files', 'stash just this file', 'partial stash',
    ],
    commands: [
      { cmd: 'git stash push -- <file1> <file2>', note: 'Stashes only the specified files.' },
    ],
  },
  {
    id: 'STASH_05', category: 'Stash',
    human: 'Stash partial file changes (patch mode)',
    phrases: [
      'stash patch', 'stash part of file', 'stash partial file', 'partial stash mode',
      'interactively stash', 'stash only some changes in file', 'stash hunks',
    ],
    commands: [
      { cmd: 'git stash push -p', note: 'Interactively selects hunks to stash.' },
    ],
  },
  {
    id: 'STASH_06', category: 'Stash',
    human: 'List all stashes',
    phrases: [
      'list stashes', 'show stashes', 'see stashes', 'view stashes', 'what stashes',
      'all stashes', 'show stash list', 'view stash list', 'print stashes',
    ],
    commands: [
      { cmd: 'git stash list', note: 'Lists all stashes.' },
    ],
  },
  {
    id: 'STASH_07', category: 'Stash',
    human: 'Apply most recent stash',
    phrases: [
      'apply stash', 'pop stash', 'restore stash', 'get stashed changes', 'unstash',
      'bring back stashed work', 'retrieve stash', 'apply saved work',
      'resume stashed work', 're-apply stash', 'get my stash back',
      'restore saved changes', 'restore my work',
    ],
    commands: [
      { cmd: 'git stash pop', note: 'Applies stash and removes it from the stash list.' },
      { cmd: 'git stash apply', note: 'Applies stash but keeps it in the list.' },
    ],
  },
  {
    id: 'STASH_08', category: 'Stash',
    human: 'Apply a specific stash',
    phrases: [
      'apply specific stash', 'apply old stash', 'restore specific stash',
      'apply stash number', 'apply stash by index', 'get old stash', 'apply stash 2',
    ],
    commands: [
      { cmd: 'git stash apply stash@{2}', note: 'Applies the third stash (0-indexed).' },
    ],
  },
  {
    id: 'STASH_09', category: 'Stash',
    human: 'Drop a stash',
    phrases: [
      'drop stash', 'delete stash', 'remove stash', 'discard stash',
      'delete specific stash', 'remove stash entry', 'kill stash',
    ],
    commands: [
      { cmd: 'git stash drop stash@{0}', note: 'Deletes a specific stash entry.' },
    ],
  },
  {
    id: 'STASH_10', category: 'Stash',
    human: 'Clear all stashes',
    phrases: [
      'clear stashes', 'delete all stashes', 'remove all stashes', 'wipe stash',
      'clear stash list', 'drop all stashes', 'purge stashes', 'empty stash',
    ],
    commands: [
      { cmd: 'git stash clear', note: 'Permanently deletes all stashes.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 6 — History & Log
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'HIST_01', category: 'History & Log',
    human: 'View commit history',
    phrases: [
      'view history', 'see history', 'show commits', 'git log', 'all commits',
      'list commits', 'commit history', 'changelog', 'show commit log',
      'print commit history', 'see commit log', 'view all commits', 'show log',
      'view log', 'list all commits', 'display history',
    ],
    commands: [
      { cmd: 'git log', note: 'Shows full commit history.' },
    ],
  },
  {
    id: 'HIST_02', category: 'History & Log',
    human: 'See commit graph (visual history)',
    phrases: [
      'see commit graph', 'visual history', 'branch graph', 'tree view', 'show graph',
      'commit tree', 'see branch tree', 'visualize history', 'pretty log',
      'history with branches', 'graph log', 'show branching',
    ],
    commands: [
      { cmd: 'git log --graph --oneline --all', note: 'Displays a visual branch graph.' },
      { cmd: 'git log --graph --decorate --all', note: 'Adds branch/tag labels to the graph.' },
    ],
  },
  {
    id: 'HIST_03', category: 'History & Log',
    human: 'Search commit messages',
    phrases: [
      'search commits', 'find commit by message', 'grep commits', 'search history message',
      'find commit message', 'search in commit messages', 'filter by commit message',
      'find commits with word', 'look for commit',
    ],
    commands: [
      { cmd: 'git log --grep "<term>"', note: 'Filters commits by message text.' },
    ],
  },
  {
    id: 'HIST_04', category: 'History & Log',
    human: 'Search who added or removed code',
    phrases: [
      'search code history', 'find when code added', 'grep code changes',
      'search file content history', 'find commit that added line', 'who added this code',
      'when was this code introduced', 'pickaxe search', 'search in diffs',
      'find when function added', 'grep in commit content',
    ],
    commands: [
      { cmd: 'git log -S "<term>"', note: 'Finds commits that added or removed a string (pickaxe).' },
      { cmd: 'git log -G "<regex>"', note: 'Regex version of pickaxe.' },
    ],
  },
  {
    id: 'HIST_05', category: 'History & Log',
    human: 'See history of a specific file',
    phrases: [
      'file history', 'history of file', 'commits for file', 'what changed in file',
      'log for file', 'see file log', 'show file history', 'view file commits',
      'file commit history', 'when was file changed', 'changes to file over time',
    ],
    commands: [
      { cmd: 'git log -- <file>', note: 'Shows commits that touched a specific file.' },
    ],
  },
  {
    id: 'HIST_06', category: 'History & Log',
    human: 'See diff of a specific commit',
    phrases: [
      'show commit diff', 'see commit changes', 'view specific commit', 'what did commit change',
      'inspect commit', 'show what commit did', 'see changes in commit', 'diff of commit',
    ],
    commands: [
      { cmd: 'git show <commit>', note: 'Shows the diff introduced by a commit.' },
    ],
  },
  {
    id: 'HIST_07', category: 'History & Log',
    human: 'Compare working tree to last commit',
    phrases: [
      'what changed since last commit', 'diff working tree', 'compare to head',
      'changes since last commit', 'uncommitted changes', 'see my current changes',
      'what did i change', 'current diff', 'what have i modified', 'unsaved diff',
      'changes from head', 'compare working to committed',
    ],
    commands: [
      { cmd: 'git diff HEAD', note: 'Shows all uncommitted changes compared to HEAD.' },
    ],
  },
  {
    id: 'HIST_08', category: 'History & Log',
    human: 'See diff between two commits',
    phrases: [
      'diff two commits', 'compare two commits', 'between commits', 'diff specific commits',
      'what changed between commits', 'changes from one commit to another',
    ],
    commands: [
      { cmd: 'git diff <commit1> <commit2>', note: 'Shows diff between two commits.' },
    ],
  },
  {
    id: 'HIST_09', category: 'History & Log',
    human: 'See compact one-line log',
    phrases: [
      'short log', 'one line log', 'compact history', 'brief history',
      'oneline log', 'simple log', 'concise history', 'condensed log',
      'quick history', 'abbreviated log',
    ],
    commands: [
      { cmd: 'git log --oneline', note: 'One line per commit — hash + message.' },
    ],
  },
  {
    id: 'HIST_10', category: 'History & Log',
    human: 'Count total commits',
    phrases: [
      'count commits', 'how many commits', 'number of commits', 'total commits',
      'commit count', 'commits so far', 'total commit count',
    ],
    commands: [
      { cmd: 'git rev-list --count HEAD', note: 'Prints total number of commits.' },
    ],
  },
  {
    id: 'HIST_11', category: 'History & Log',
    human: 'See author contribution stats',
    phrases: [
      'author stats', 'contribution stats', 'who committed most', 'commit count per author',
      'who contributed most', 'contributions by person', 'top contributors',
      'commit stats', 'who has most commits',
    ],
    commands: [
      { cmd: 'git shortlog -sn', note: 'Shows commit count sorted by contributor.' },
    ],
  },
  {
    id: 'HIST_12', category: 'History & Log',
    human: 'Show reflog (HEAD history)',
    phrases: [
      'reflog', 'show reflog', 'recovery log', 'head history', 'git reflog',
      'show head movements', 'see what head pointed to', 'git recovery log',
      'undo history', 'git history of checkouts', 'trail of head',
    ],
    commands: [
      { cmd: 'git reflog', note: 'Shows history of HEAD movements — useful for recovery.' },
    ],
  },
  {
    id: 'HIST_13', category: 'History & Log',
    human: 'Filter log by author',
    phrases: [
      'log by author', 'commits by person', 'filter commits by author',
      'show my commits', 'find commits by user', 'commits from specific author',
      'who committed what', 'commits by me',
    ],
    commands: [
      { cmd: 'git log --author="<name>"', note: 'Filters commits by author name.' },
    ],
  },
  {
    id: 'HIST_14', category: 'History & Log',
    human: 'Who wrote this line (blame)',
    phrases: [
      'who wrote', 'who changed line', 'blame file', 'git blame', 'line author',
      'who is responsible for this line', 'who wrote this', 'who changed this',
      'who added this line', 'who edited this', 'find author of line',
      'who is to blame', 'who did this', 'who touched this line', 'blame',
    ],
    commands: [
      { cmd: 'git blame <file>', note: 'Shows who last modified each line of a file.' },
    ],
  },
  {
    id: 'HIST_15', category: 'History & Log',
    human: 'See the last N commits',
    phrases: [
      'last n commits', 'recent commits', 'show last 5 commits', 'latest commits',
      'last few commits', 'show recent 10', 'most recent commits', 'last commits',
    ],
    commands: [
      { cmd: 'git log -n <N>', note: 'Shows the N most recent commits.' },
    ],
  },
  {
    id: 'HIST_16', category: 'History & Log',
    human: 'Find when a bug was introduced (bisect)',
    phrases: [
      'find bug commit', 'bisect', 'binary search commits', 'when was bug introduced',
      'find bad commit', 'hunt regression', 'find where bug started', 'git bisect',
      'find breaking commit', 'debug commit history', 'regression search',
    ],
    commands: [
      { cmd: 'git bisect start', note: 'Starts a binary search through commit history.' },
      { cmd: 'git bisect bad && git bisect good <commit>', note: 'Marks good/bad to narrow down the culprit.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 7 — Conflict Resolution
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'CONFLICT_01', category: 'Conflict Resolution',
    human: 'See merge conflicts',
    phrases: [
      'see conflicts', 'show conflicts', 'list conflicts', 'merge conflict',
      'which files conflict', 'find conflicts', 'view conflicts', 'check conflicts',
      'what has conflicts', 'show merge conflicts', 'conflict files',
    ],
    commands: [
      { cmd: 'git status', note: 'Lists conflicted files under "Unmerged paths".' },
    ],
  },
  {
    id: 'CONFLICT_02', category: 'Conflict Resolution',
    human: 'Accept our version in conflict',
    phrases: [
      'keep our version', 'accept ours', 'use our changes', 'keep mine',
      'resolve with ours', 'take our version', 'keep local version',
      'my version wins', 'use local changes', 'prefer our side',
    ],
    commands: [
      { cmd: 'git checkout --ours <file>', note: 'Keeps your branch version of a conflicted file.' },
    ],
  },
  {
    id: 'CONFLICT_03', category: 'Conflict Resolution',
    human: 'Accept their version in conflict',
    phrases: [
      'keep their version', 'accept theirs', 'use their changes', 'keep incoming',
      'resolve with theirs', 'take their version', 'keep remote version',
      'their version wins', 'use incoming changes', 'prefer their side',
    ],
    commands: [
      { cmd: 'git checkout --theirs <file>', note: 'Keeps the incoming branch version.' },
    ],
  },
  {
    id: 'CONFLICT_04', category: 'Conflict Resolution',
    human: 'Mark conflict as resolved',
    phrases: [
      'mark resolved', 'conflict resolved', 'resolve conflict', 'accept conflict resolution',
      'finish resolving conflict', 'done resolving', 'mark file as resolved',
      'conflict fixed', 'continue after conflict', 'add after conflict',
    ],
    commands: [
      { cmd: 'git add <file>', note: 'Marks a file as conflict-resolved after editing.' },
    ],
  },
  {
    id: 'CONFLICT_05', category: 'Conflict Resolution',
    human: 'Abort a rebase in progress',
    phrases: [
      'abort rebase', 'cancel rebase', 'stop rebase', 'exit rebase', 'quit rebase',
      'give up rebase', 'undo rebase in progress', 'back out of rebase',
    ],
    commands: [
      { cmd: 'git rebase --abort', note: 'Cancels the current rebase and restores original state.' },
    ],
  },
  {
    id: 'CONFLICT_06', category: 'Conflict Resolution',
    human: 'Recover a deleted file',
    phrases: [
      'recover deleted file', 'restore deleted file', 'get back deleted file',
      'undo delete file', 'undelete file', 'bring back deleted file',
      'file i deleted by accident', 'accidentally deleted file', 'restore removed file',
      'get file back after deletion', 'recover file', 'file was deleted',
    ],
    commands: [
      { cmd: 'git restore <file>', note: 'Gets the file back from HEAD.' },
      { cmd: 'git checkout HEAD -- <file>', note: 'Legacy equivalent.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 8 — Rebase & Cherry-pick
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'REBASE_01', category: 'Rebase & Cherry-pick',
    human: 'Rebase branch onto main',
    phrases: [
      'rebase on main', 'rebase onto main', 'rebase branch', 'move branch onto main',
      'replay commits on main', 'rebase from main', 'move my commits onto main',
      'sync branch with main', 'bring branch up to date with main via rebase',
    ],
    commands: [
      { cmd: 'git rebase main', note: 'Replays current branch commits on top of main.' },
    ],
  },
  {
    id: 'REBASE_02', category: 'Rebase & Cherry-pick',
    human: 'Interactive rebase',
    phrases: [
      'interactive rebase', 'rebase interactive', 'reorder commits', 'edit commits',
      'squash with rebase', 'edit commit history', 'clean up commits rebase',
      'rebase -i', 'modify old commits', 'drop commits', 'reword commits',
      'fix up commits', 'edit past commits',
    ],
    commands: [
      { cmd: 'git rebase -i HEAD~<N>', note: 'Opens interactive editor for last N commits.' },
    ],
  },
  {
    id: 'REBASE_03', category: 'Rebase & Cherry-pick',
    human: 'Squash commits via interactive rebase',
    phrases: [
      'squash via rebase', 'squash commits rebase', 'combine commits rebase',
      'rebase squash', 'squash with interactive rebase', 'flatten commits rebase',
    ],
    commands: [
      { cmd: 'git rebase -i HEAD~<N>', note: 'Use "squash" in the interactive editor.' },
    ],
  },
  {
    id: 'REBASE_04', category: 'Rebase & Cherry-pick',
    human: 'Continue rebase after resolving conflict',
    phrases: [
      'continue rebase', 'rebase continue', 'resume rebase', 'next rebase step',
      'rebase --continue', 'proceed with rebase', 'conflict fixed continue rebase',
    ],
    commands: [
      { cmd: 'git rebase --continue', note: 'Continues the rebase after resolving a conflict.' },
    ],
  },
  {
    id: 'REBASE_05', category: 'Rebase & Cherry-pick',
    human: 'Skip a commit during rebase',
    phrases: [
      'skip commit rebase', 'rebase skip', 'skip this commit rebase',
      'skip conflicting commit', 'rebase --skip',
    ],
    commands: [
      { cmd: 'git rebase --skip', note: 'Skips the current conflicting commit during rebase.' },
    ],
  },
  {
    id: 'REBASE_06', category: 'Rebase & Cherry-pick',
    human: 'Rebase onto a specific commit',
    phrases: [
      'rebase onto commit', 'move commits after commit', 'rebase from commit',
      'rebase onto specific point', 'move branch to new base',
    ],
    commands: [
      { cmd: 'git rebase --onto <new-base> <old-base> <branch>', note: 'Moves a branch to a new base.' },
    ],
  },
  {
    id: 'REBASE_07', category: 'Rebase & Cherry-pick',
    human: 'Cherry-pick a specific commit',
    phrases: [
      'cherry pick', 'cherry-pick commit', 'copy commit', 'bring commit',
      'port commit', 'grab commit from another branch', 'take commit from branch',
      'apply commit from another branch', 'pick specific commit', 'import commit',
      'bring commit from other branch', 'copy commit to here',
    ],
    commands: [
      { cmd: 'git cherry-pick <commit>', note: 'Applies a single commit to the current branch.' },
    ],
  },
  {
    id: 'REBASE_08', category: 'Rebase & Cherry-pick',
    human: 'Cherry-pick a range of commits',
    phrases: [
      'cherry pick range', 'cherry-pick multiple', 'copy multiple commits',
      'port commits range', 'apply range of commits', 'bring multiple commits',
      'cherry pick several', 'import multiple commits',
    ],
    commands: [
      { cmd: 'git cherry-pick <start>..<end>', note: 'Applies a range of commits.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 9 — Tags & Releases
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'TAG_01', category: 'Tags & Releases',
    human: 'Create a lightweight tag',
    phrases: [
      'create tag', 'make tag', 'add tag', 'tag commit', 'label release', 'mark version',
      'create lightweight tag', 'add lightweight tag', 'simple tag', 'quick tag',
      'tag this commit', 'mark this commit',
    ],
    commands: [
      { cmd: 'git tag <name>', note: 'Creates a lightweight pointer tag.' },
    ],
  },
  {
    id: 'TAG_02', category: 'Tags & Releases',
    human: 'Create annotated tag',
    phrases: [
      'create annotated tag', 'annotated tag', 'tag with message', 'signed tag',
      'release tag', 'detailed tag', 'tag with description', 'full tag',
    ],
    commands: [
      { cmd: 'git tag -a v1.0 -m "Release v1.0"', note: 'Creates a full tag object with metadata.' },
    ],
  },
  {
    id: 'TAG_03', category: 'Tags & Releases',
    human: 'List all tags',
    phrases: [
      'list tags', 'show tags', 'see tags', 'all tags', 'view tags',
      'print tags', 'display tags', 'what tags exist',
    ],
    commands: [
      { cmd: 'git tag', note: 'Lists all local tags.' },
    ],
  },
  {
    id: 'TAG_04', category: 'Tags & Releases',
    human: 'Delete a tag',
    phrases: [
      'delete tag', 'remove tag', 'drop tag', 'erase tag', 'destroy tag',
      'get rid of tag', 'delete release tag', 'remove version tag',
    ],
    commands: [
      { cmd: 'git tag -d <name>', note: 'Deletes a local tag.' },
      { cmd: 'git push origin --delete <name>', note: 'Deletes the tag from the remote.' },
    ],
  },
  {
    id: 'TAG_05', category: 'Tags & Releases',
    human: 'Checkout a tag (detached HEAD)',
    phrases: [
      'checkout tag', 'switch to tag', 'go to tag version', 'use tag',
      'open tag', 'checkout specific version', 'open release tag',
      'view old release', 'go to version',
    ],
    commands: [
      { cmd: 'git checkout <tag>', note: 'Checks out a tag (puts repo in detached HEAD state).' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 10 — Config & Setup
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'CONFIG_01', category: 'Config & Setup',
    human: 'Set username and email',
    phrases: [
      'set username', 'set email', 'configure git', 'setup git', 'git config name',
      'set user', 'set my name', 'set my email', 'git user config',
      'change my name in git', 'update email', 'set global user info',
      'configure identity', 'set author info',
    ],
    commands: [
      { cmd: 'git config --global user.name "Name"', note: 'Sets your global username.' },
      { cmd: 'git config --global user.email "email"', note: 'Sets your global email.' },
    ],
  },
  {
    id: 'CONFIG_02', category: 'Config & Setup',
    human: 'Initialize a new repository',
    phrases: [
      'init repo', 'initialize repository', 'create new repo', 'start repo',
      'new git project', 'create git repo', 'make git project', 'setup new git repo',
      'initialize new project', 'start git tracking', 'create local repo',
    ],
    commands: [
      { cmd: 'git init', note: 'Initializes a new Git repository in the current directory.' },
    ],
  },
  {
    id: 'CONFIG_03', category: 'Config & Setup',
    human: 'See current git config',
    phrases: [
      'see config', 'show config', 'view git config', 'check git settings', 'list config',
      'what is my git config', 'read config', 'print config', 'view all settings',
    ],
    commands: [
      { cmd: 'git config --list', note: 'Lists all active config settings.' },
    ],
  },
  {
    id: 'CONFIG_04', category: 'Config & Setup',
    human: 'Set default editor',
    phrases: [
      'set editor', 'change editor', 'git editor', 'configure editor',
      'use vscode as editor', 'default editor', 'change default editor',
      'set commit editor', 'use nano as editor', 'use vim as editor',
    ],
    commands: [
      { cmd: 'git config --global core.editor "code --wait"', note: 'Sets VS Code as the editor.' },
    ],
  },
  {
    id: 'CONFIG_05', category: 'Config & Setup',
    human: 'Create a git alias',
    phrases: [
      'git alias', 'create alias', 'add shortcut', 'custom command', 'make alias',
      'add git shortcut', 'create command shortcut', 'custom git command',
      'define alias', 'configure shorthand',
    ],
    commands: [
      { cmd: 'git config --global alias.<short> "<command>"', note: 'Creates a reusable command shortcut.' },
    ],
  },
  {
    id: 'CONFIG_06', category: 'Config & Setup',
    human: 'Ignore a file (add to .gitignore)',
    phrases: [
      'ignore file', 'gitignore', 'add to gitignore', 'exclude file', 'hide file from git',
      'skip file', 'untrack file', 'stop tracking file', 'gitignore a file',
      'make git ignore file', 'exclude from repository', 'keep file out of git',
      'do not track this file',
    ],
    commands: [
      { cmd: 'echo "<pattern>" >> .gitignore', note: 'Adds a pattern to .gitignore.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 11 — Submodules
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'SUB_01', category: 'Submodules',
    human: 'Add a submodule',
    phrases: [
      'add submodule', 'add dependency repo', 'include submodule', 'attach submodule',
      'nest repo', 'add nested repo', 'include external repo', 'submodule add',
      'embed repo', 'add external project',
    ],
    commands: [
      { cmd: 'git submodule add <url> <path>', note: 'Adds a submodule at a path.' },
    ],
  },
  {
    id: 'SUB_02', category: 'Submodules',
    human: 'Clone with submodules',
    phrases: [
      'clone with submodules', 'clone submodules', 'clone include submodules',
      'recursive clone', 'clone and init submodules', 'full clone with dependencies',
    ],
    commands: [
      { cmd: 'git clone --recurse-submodules <url>', note: 'Clones and initializes all submodules.' },
    ],
  },
  {
    id: 'SUB_03', category: 'Submodules',
    human: 'Initialize and fetch submodules',
    phrases: [
      'init submodules', 'initialize submodules', 'setup submodules', 'pull submodules',
      'get submodules', 'fetch submodules', 'download submodules', 'setup nested repos',
    ],
    commands: [
      { cmd: 'git submodule init', note: 'Registers submodules from .gitmodules.' },
      { cmd: 'git submodule update', note: 'Checks out submodule content.' },
    ],
  },
  {
    id: 'SUB_04', category: 'Submodules',
    human: 'Update submodules to latest',
    phrases: [
      'update submodules', 'pull submodule updates', 'sync submodules', 'refresh submodules',
      'update nested repos', 'get latest submodules', 'submodule update remote',
    ],
    commands: [
      { cmd: 'git submodule update --remote', note: 'Updates all submodules to their latest remote commits.' },
    ],
  },
  {
    id: 'SUB_05', category: 'Submodules',
    human: 'Remove a submodule',
    phrases: [
      'remove submodule', 'delete submodule', 'detach submodule', 'unlink submodule',
      'deinit submodule', 'get rid of submodule', 'remove nested repo',
    ],
    commands: [
      { cmd: 'git submodule deinit <path>', note: 'Unregisters the submodule.' },
      { cmd: 'git rm <path>', note: 'Removes the submodule directory.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 12 — Worktrees & Advanced
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'WORK_01', category: 'Worktrees & Advanced',
    human: 'Add a worktree',
    phrases: [
      'add worktree', 'create worktree', 'parallel checkout', 'checkout branch in new directory',
      'work on branch in separate folder', 'multiple working directory', 'git worktree add',
    ],
    commands: [
      { cmd: 'git worktree add <path> <branch>', note: 'Checks out a branch into a separate directory.' },
    ],
  },
  {
    id: 'WORK_02', category: 'Worktrees & Advanced',
    human: 'List all worktrees',
    phrases: [
      'list worktrees', 'show worktrees', 'view worktrees', 'all worktrees',
      'what worktrees', 'git worktree list',
    ],
    commands: [
      { cmd: 'git worktree list', note: 'Lists all linked worktrees.' },
    ],
  },
  {
    id: 'WORK_03', category: 'Worktrees & Advanced',
    human: 'Remove a worktree',
    phrases: [
      'remove worktree', 'delete worktree', 'detach worktree', 'get rid of worktree',
      'drop worktree', 'clean up worktree',
    ],
    commands: [
      { cmd: 'git worktree remove <path>', note: 'Removes a worktree.' },
    ],
  },
  {
    id: 'WORK_04', category: 'Worktrees & Advanced',
    human: 'Bundle repository for offline transfer',
    phrases: [
      'bundle repo', 'git bundle', 'offline transfer repo', 'pack repo',
      'archive repo', 'export repo', 'bundle project', 'create bundle',
    ],
    commands: [
      { cmd: 'git bundle create <file> --all', note: 'Bundles all refs into a single file.' },
    ],
  },
  {
    id: 'WORK_05', category: 'Worktrees & Advanced',
    human: 'Enable rerere (auto-reuse conflict resolutions)',
    phrases: [
      'rerere', 'reuse conflict resolution', 'record conflict resolution', 'auto resolve conflicts',
      'remember conflict resolution', 'enable rerere', 'save conflict fix',
    ],
    commands: [
      { cmd: 'git config --global rerere.enabled true', note: 'Enables rerere globally.' },
      { cmd: 'git rerere', note: 'Re-applies recorded conflict resolutions.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CATEGORY 13 — Status & Diff
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'STATUS_01', category: 'Status & Diff',
    human: 'Check repo status',
    phrases: [
      'status', 'check status', 'what is happening', 'what is going on',
      'repo status', 'see status', 'view status', 'whats changed', 'what is modified',
      'show status', 'check what changed', 'see what is going on',
      'repo state', 'current state', 'changes overview',
      'see what files changed', 'what files changed', 'which files changed',
      'list changed files', 'show changed files', 'what was modified',
    ],
    commands: [
      { cmd: 'git status', note: 'Shows the current state of the working tree and staging area.' },
    ],
  },
  {
    id: 'STATUS_02', category: 'Status & Diff',
    human: 'See diff of unstaged changes',
    phrases: [
      'see diff', 'show diff', 'what changed', 'view diff', 'unstaged diff',
      'changes not staged', 'what did i edit', 'current edits diff',
      'see what i changed', 'diff working tree', 'see my edits',
      'what did i change', 'what have i changed', 'show my changes',
      'view my edits', 'what have i edited', 'show current edits',
    ],
    commands: [
      { cmd: 'git diff', note: 'Shows unstaged changes in the working tree.' },
    ],
  },
  {
    id: 'STATUS_03', category: 'Status & Diff',
    human: 'See diff of staged changes',
    phrases: [
      'staged diff', 'diff staged', 'diff index', 'diff cached', 'staged changes diff',
      'what will be committed diff', 'diff what is staged',
    ],
    commands: [
      { cmd: 'git diff --cached', note: 'Shows diff of what is staged for commit.' },
    ],
  },
  {
    id: 'STATUS_04', category: 'Status & Diff',
    human: 'Discard all local changes (full reset)',
    phrases: [
      'discard all changes', 'undo all changes', 'reset everything', 'clean working tree',
      'throw away all changes', 'revert to last commit', 'get rid of all changes',
      'hard reset to head', 'reset all files', 'lose all my changes',
      'wipe all changes', 'go back to last clean state', 'nuke all changes',
    ],
    commands: [
      { cmd: 'git restore .', note: 'Discards all unstaged changes.' },
      { cmd: 'git reset --hard HEAD', note: 'Resets everything to last commit.' },
    ],
  },
  {
    id: 'STATUS_05', category: 'Status & Diff',
    human: 'Remove untracked files (clean)',
    phrases: [
      'remove untracked files', 'clean untracked', 'delete untracked files',
      'git clean', 'clean working directory', 'remove new untracked files',
      'wipe untracked', 'delete build files', 'remove generated files',
    ],
    commands: [
      { cmd: 'git clean -fd', note: 'Removes untracked files and directories.' },
    ],
  },

];

module.exports = { INTENTS };
