// one simple api key 'bAsp%SfY*iDwB#!0Katm'
const natural = require('natural');
const tokenizer = new natural.RegexpTokenizer({ pattern: /(\n|\r\n)+/ });

function calculateReadability(text) {
    const totalWords = text.match(/\b\w+\b/g)?.length;
    const totalSentences = text.split(/[.!?]/g).length;
    const totalSyllables = text.match(/[aeiouy]+/ig)?.length;

    if (totalWords && totalSentences && totalSyllables) {
        const score = 206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords));

        return Math.round(score);
    } else {
        return null;
    }
}

function calculateGradeLevel(text) {
    let score = calculateReadability(text);

    if (score >= 90) {
        return "5th grade";
    } else if (score >= 80) {
        return "6th grade";
    } else if (score >= 70) {
        return "7th grade";
    } else if (score >= 60) {
        return "8th & 9th grade";
    } else if (score >= 50) {
        return "10th to 12th grade";
    } else if (score >= 30) {
        return "College";
    } else if (score >= 10) {
        return "College Graduate";
    } else {
        return "Very Hard to Read - Professional Level";
    }
}

function calculateSentiment(text) {
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const score = Math.floor(analyzer.getSentiment(text.split(' ')));
    if (score > 0) {
        return "Positive";
    } else if (score < 0) {
        return "Negative";
    } else {
        return "Neutral";
    }
}

function countSentences(text) {
    const sentences = text.split(/[.?!]+/);
    const count = sentences.length - 1;

    return count;
}

function countLines(text) {
    const lines = text.split('\n');
    return lines.length;
}

function calculateReadingTime(text, wordsPerMinute = 200) {
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return `${readingTime} minutes`;
}

module.exports = {
    calculateGradeLevel,
    calculateSentiment,
    calculateReadability,
    countSentences,
    calculateReadingTime,
    countLines,
};