const numberWords = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'forty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90,
    'hundred': 100,
    'thousand': 1000,
    'million': 1000000,
    'billion': 1000000000
};

export function wordsToNumbers(text) {
    if (!text) return null;
    
    // Convert to lowercase and remove punctuation
    text = text.toLowerCase().replace(/[.,]/g, '');
    
    // Split into words
    const words = text.split(/\s+/);
    
    let result = 0;
    let current = 0;
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const number = numberWords[word];
        
        if (number === undefined) {
            // If we can't convert the word, return the original text
            return text;
        }
        
        if (number === 100) {
            current = current * number;
        } else if (number === 1000 || number === 1000000 || number === 1000000000) {
            current = (current || 1) * number;
            result += current;
            current = 0;
        } else {
            current += number;
        }
    }
    
    result += current;
    
    return result || text;
} 