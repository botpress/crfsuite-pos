from sklearn_crfsuite import CRF, metrics
from sklearn.model_selection import train_test_split

# TODO make this a jupyter notebook instead, easier to iterate
from pos.dataset import make_dataset

X, y = make_dataset('../data/med-spacy.txt')
# split train and test set
x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# train
crf = CRF(algorithm='lbfgs', c1=0.01, c2=0.1, max_iterations=200, all_possible_transitions=True, model_filename='./pos-py.model')
crf.fit(x_train, y_train)  # we might want to split the train set in 2 ==> train and dev sets

# evaluate
y_preds = crf.predict(x_test)
f1 = metrics.flat_f1_score(y_test, y_preds, average='weighted', labels=crf.classes_)
print('F1 is ', f1)

seq_accuracy = metrics.sequence_accuracy_score(y_test, y_preds)
print('seq accuracy', seq_accuracy)
