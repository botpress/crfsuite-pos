const dataset = require("./dataset");
const { TrainerClass, TaggerClass } = require("./crfsuite.node");
const { features } = require("./features");

let callbackCount = 0;

async function train() {
  const [X, Y] = await dataset(__dirname + "/../data/fr/out-xs.txt");
  const trainer = TrainerClass();
  trainer.set_params({
    c1: "0.001",
    c2: "0.1",
    max_iterations: "500",
    "feature.possible_transitions": "1",
    "feature.possible_states": "1"
  });
  trainer.set_callback(data => {
    if (++callbackCount % 10 === 0) {
      console.log(data);
    }
  });

  for (let i = 0; i < X.length; i++) {
    trainer.append(X[i], Y[i]);
  }
  //
  trainer.train("mod-fr.model");
}
function test(t) {
  const words = t.split(" ");
  const feats = words.map((w, idx) => features(words, idx));
  const tagger = TaggerClass();
  tagger.open("mod-fr.model");
  console.log(t, "\n", tagger.tag(feats).result, "\n\n");
}

train().then(() => {
  test("Les autorités demandent à la population de rester confiné");
  test("Jusqu'à 1008 travailleurs pourraient être touchés");
  test("Le président le répète, il est en guerre.");
  test("Cela pourrait etre une persé majeure dit-il.");
  test("Dans les centres de santé, on prévoi une pénurie de matériel.");
  test("Des jeunes vacanciers viennent sur les plages par centaines.");
  // test("You might want to behave like if you are not like one of us")
  // test("the animals on wall street where the lions stood were freaking hot")
  // test('the cat in the night will always be hungry')
});
