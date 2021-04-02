import os

import spacy

nlp = spacy.load("fr_core_news_md")
print('loaded')
source = os.path.abspath(os.path.dirname(__name__)) + '/../data/fr/full.txt'
target = os.path.abspath(os.path.dirname(__name__)) + '/../data/fr/out-spacy.txt'


with open(target, 'a') as res:
    with open(source) as f:
        for l in f:
            toks = [t.split("_")[0] for t in l.split(' ') if t != '\n' and t != '']
            if len(toks) < 4: continue

            phrase = ' '.join(toks)
            doc = nlp(phrase)
            combined = [f'{t.text}_{t.pos_}' for t in doc]
            line = ' '.join(combined) + '\n'
            res.write(line)
