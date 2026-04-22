'use strict';

const fs = require('fs');

function generateCompletion(shell) {
  const { INTENTS } = require('./data/intents');
  const { tokenize } = require('./nlp');

  // Build a set of all unique words used in intent phrases
  const vocabSet = new Set();
  for (const intent of INTENTS) {
    for (const phrase of intent.phrases) {
      const tokens = tokenize(phrase);
      for (const t of tokens) vocabSet.add(t);
    }
  }
  const words = Array.from(vocabSet).sort();

  if (shell === 'bash') {
    return `
_giti_completion() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  local words="${words.join(' ')}"
  COMPREPLY=( $(compgen -W "$words" -- "$cur") )
}
complete -F _giti_completion giti
`;
  }

  if (shell === 'zsh') {
    return `
#compdef giti
_giti() {
  local -a words
  words=(${words.join(' ')})
  _describe -t commands "giti commands" words
}
compdef _giti giti
`;
  }

  if (shell === 'fish') {
    return `
complete -c giti -f -a "${words.join(' ')}"
`;
  }

  return `echo "Unsupported shell: ${shell}. Supported: bash, zsh, fish"`;
}

module.exports = { generateCompletion };
