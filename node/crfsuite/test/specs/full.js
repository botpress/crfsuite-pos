'use strict'

const fs = require('fs')
const test = require('tape')
const path = require('path')
const crfsuite = require('../..')
const tagger = crfsuite.Tagger()
const trainer = new crfsuite.Trainer()

test('crfsuite tagger', function(t) {
  t.plan(4)

  trainer.set_callback(str => {
    /* silence output */
  })

  let model_filename = path.resolve('./model.crfsuite')

  if (fs.existsSync(model_filename)) {
    fs.unlinkSync(model_filename)
  }

  t.notOk(fs.existsSync(model_filename), 'model file must not exist before training')

  let xseq = [['T1:5', 'walk'], ['T1:5', 'walk', 'shop'], ['T1:5', 'clean', 'shop']]
  let yseq = ['sunny', 'sunny', 'rainy']
  trainer.append(xseq, yseq)

  trainer.train(model_filename)

  console.log('File model path: ' + model_filename)
  let is_opened = tagger.open(model_filename)

  t.ok(is_opened, 'File model is opened')

  let { probability, result: tags } = tagger.tag([['T1', 'walk'], ['T1', 'walk', 'shop'], ['T1', 'clean', 'shop']])
  let probs = tagger.marginal([['T1', 'walk'], ['T1', 'walk', 'shop'], ['T1', 'clean', 'shop']])
  console.log('Tags: ', tags)
  console.log('Marginal probs: ', probs)

  t.deepEqual(tags, ['sunny', 'sunny', 'rainy'], 'walk, walk+shop, clean+shop')
  t.ok(probability >= 0.2, 'probability OK')
})
