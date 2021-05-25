/** Command-line tool to generate Markov text. */
const {readFile, readUrl} = require('./markov');

//arguments
let type = process.argv[2];
let path = process.argv[3];
let wordCount = process.argv[4];
if(type === 'file') {
    readFile(path, wordCount)
} else if(type === 'url') {
    readUrl(path, wordCount)
}

