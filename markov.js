const fs = require('fs');
const axios = require('axios');

/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
    // console.log(this.chains);
    console.log(this.words.length)
    // MarkovMachine.writeOutput('output.txt', JSON.stringify(this.chains))
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};
    let nextWord;
    for(let i = 0; i < this.words.length; i++) {
      let firstWord = this.words[i];
      let secondWord = this.words[i+1];
      if(!secondWord) {
        nextWord = null;
      } else {
        nextWord = this.words[i+2];
      }
      if(this.chains[`${firstWord} ${secondWord}`]) {
        this.chains[`${firstWord} ${secondWord}`].push(nextWord)
      } else {
        this.chains[`${firstWord} ${secondWord}`] = [nextWord]
      }
    }
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    // TODO
    const arr = Object.keys(this.chains);
    let randomIndex = MarkovMachine.getRandomIndex(arr.length)
    let startingWord = arr[randomIndex];
    let output = [startingWord];
    let currWord = startingWord;
    let nextWord;
    while(output.length < numWords && currWord !== null){
      randomIndex = MarkovMachine.getRandomIndex(this.chains[currWord].length);
      nextWord = this.chains[currWord][randomIndex];
      output.push(nextWord);
      currWord = `${currWord.split(" ")[1]} ${nextWord}`;
    }
    // console.log(output.join(' '));
    MarkovMachine.writeOutput('output.txt', output.join(' '));
  }

  static getRandomIndex(numValues) {
    return Math.floor(Math.random()*numValues);
  }

  static writeOutput(outputPath, output) {
    fs.writeFile(outputPath, output, 'utf8', err => {
      if(err){
        console.log("Error: Could not write file", err)
      }
    });
  }

}


function readFile(path, wordCount) {
  fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
    if(err) {
      console.log('Error! Could not read file', err);
      process.exit(1)
    }
    let mm = new MarkovMachine(data)
    mm.makeText(wordCount);
  });
}

async function readUrl(url, wordCount) {
  let res = await axios.get(url);
  let mm = new MarkovMachine(res.data);
  mm.makeText(wordCount)
}

module.exports = {
  readFile: readFile,
  readUrl: readUrl
}

// readFile('Hank.txt');