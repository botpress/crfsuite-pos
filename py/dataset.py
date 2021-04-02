import re
import numpy as np


def n_alpha(word: str) -> int:
    # TODO: support other alphabets
    return len(re.findall('[a-zA-Z]', word))


def n_num(word):
    return len(re.findall('\d', word))


def pref(word, idx):
    return '' if len(word) < idx + 1 else word[:idx + 1]


def suf(word, right_idx):
    return '' if len(word) < right_idx + 1 else word[-right_idx - 1:]


def remove_empty(feats):
    feats2 = feats.copy()
    for key, val in feats.items():
        if val == '':
            del feats2[key]

    return feats2


def features(word: str, idx, seq):
    alpha = n_alpha(word)
    num = n_num(word)
    bos = idx == 0
    eos = idx == len(seq) - 1
    feats = {
        'BOS': bos,
        'EOS': eos,
        'prefix_1': word[0],
        'prefix_2': pref(word, 1),
        'prefix_3': pref(word, 2),
        'prefix_4': pref(word, 3),
        'suffix_1': suf(word, 1),
        'suffix_2': suf(word, 2),
        'suffix_3': suf(word, 3),
        'suffix_4': suf(word, 4),
        'len': len(word),
        'alpha': alpha,
        'contains_num': num > 0,  # might want to replace by a bool "contains num"
        'contains_special': len(word) - alpha - num > 0,  # might want to replace by a bool "contains special"
        'word': word.lower(),
        'prev_word': '' if bos else seq[idx - 1].split("_")[0].lower(),
        'next_word': '' if eos else seq[idx + 1].split("_")[0].lower(),
    }
    return remove_empty(feats)


def parse_word(word_with_tag, idx, tagged_sentence):
    word, tag = word_with_tag.split('_')
    return [features(word, idx, tagged_sentence), tag]


def token_valid(tok: str):
    if '_' not in tok:
        return False
    w, t = tok.split('_')
    return w != '' and t != ''


def make_dataset(fn):
    X, Y = [], []
    with open(fn) as f:
        for line in f:
            sentence_tags = [x for x in filter(lambda x: token_valid(x), line.split(' '))]
            seq = np.array([parse_word(w, idx, sentence_tags) for idx, w in enumerate(sentence_tags)])
            X.append(seq[:, 0])
            Y.append(seq[:, 1])
    return X, Y
