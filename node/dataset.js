const fs = require("fs");
const readline = require("readline");
const _ = require("lodash");
const { features } = require("./features");

function validWordTag(wt) {
  return /_/.test(wt) && wt.split("_").every(Boolean);
}

function parseLine(line) {
  return _.chain(line.split(" "))
    .filter(validWordTag)
    .map(wt => wt.split("_"))
    .unzip()
    .thru(([seq, tags]) => {
      if (seq) {
        return [seq.map((_, idx) => features(seq, idx)), tags];
      }
    })
    .filter(Boolean)
    .value();
}

module.exports = async function makeDS(fn) {
  const p = new Promise((resolve, reject) => {
    const stream = fs.createReadStream(fn);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let X = [];
    let Y = [];

    rl.on("line", l => {
      const [x, y] = parseLine(l);
      if (
        _.isArray(x) &&
        _.isArray(y) &&
        x.length == y.length &&
        x.length <= 50
      ) {
        X.push(x);
        Y.push(y);
      }
    });

    rl.on("close", () => resolve([X, Y]));
  });

  return p;
};
