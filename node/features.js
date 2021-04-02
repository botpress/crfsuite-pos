function n_alpha(word){
    // TODO support more alphabets
    return (word.match(/[a-zA-z]/g) || []).length
}

function n_digits(word){
    return (word.match(/\d/g) || []).length
}

function pref(word, nchars){
    return word.length > nchars ?word.slice(0, nchars) : ''
}

function suff(word, nchars){
    return word.length > nchars ? word.slice(-nchars) : ''
}

function features(seq, idx){

    const word = seq[idx].toLowerCase()
    const a = n_alpha(word)
    const d = n_digits(word)
    const bos = idx === 0
    const eos = idx == seq.length - 1
    const feats = {
        'BOS': bos,
        'EOS': eos,
        'prefix_1': pref(word,1),
        'prefix_2': pref(word,2),
        'prefix_3': pref(word,3),
        'prefix_4': pref(word,4),
        'suffix_1': suff(word,1),
        'suffix_2': suff(word,2),
        'suffix_3': suff(word,3),
        'suffix_4': suff(word,4),
        'len': word.length,
        'alpha': a,
        'contains_num': d >0,
        'contains_special': word.length - a - d >0,
        'word': word,
        'prev_word': bos ? "": seq[idx-1].toLowerCase(),
        'next_word': eos ? "": seq[idx+1].toLowerCase(),
    }

    return Object.entries(feats)
        .filter(([key, val]) => val)
        .map(([key, val]) => {
            const v = typeof val === 'boolean' ? '' :`=${val}`
            return `${key}${v}`
        })   
}

module.exports = {
    features
}