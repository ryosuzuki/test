import spacy
import json
nlp = spacy.load('en_core_web_lg')

def findContainingEntity(noun, ents):
    print(ents)
    for ent in ents:
        if noun.text in ent.text:
            return ent.text
    return noun

def extractAction(sentence, actions):
    doc = nlp(sentence)

    action = None
    maxSimilarity = 0

    for token in doc:
        if token.pos_ == 'VERB':
            directObject = token.children
            directObject = [
                child for child in directObject if child.dep_ == 'dobj']
            if directObject:
                directObject = directObject[0]
                if directObject.pos_ == 'NOUN':
                    # Check if the noun has any extra details (e.g. 'verb -> noun -> additional information')
                    nounText = directObject.text
                    for child in directObject.children:
                        if child.dep_ == 'prep':
                            nounText += ' ' + child.text
                            for grandchild in child.children:
                                if grandchild.dep_ == 'pobj':
                                    nounText += ' ' + grandchild.text

                    for predefinedAction in actions:
                        print(nounText)
                        # similarity = directObject.similarity(nlp(predefinedAction))
                        similarity = nlp(nounText).similarity(nlp(predefinedAction))
                        if similarity > maxSimilarity:
                            action = predefinedAction
                            maxSimilarity = similarity
                    break

    if action is None:
        return None

    return {'action': action, 'similarity': maxSimilarity}

# actions = ['Table of Contents', 'Summary of Document', 'Statistics', 'People Profiles', 'Phrase Vocabulary in Document', 'Information about Person/Place/Thing']
actions = ['Table of Contents', 'Summary of Document', 'Key Phrases or terms or words']
# response = extractAction('give me a brief description about this page', actions)
# print(response) 

while True:
    sentence = input()
    print("python:"+sentence)
    response = extractAction(sentence, actions)
    if response is not None:
        print(json.dumps(response))     
    else:
        print('none')
