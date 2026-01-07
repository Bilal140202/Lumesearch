
const commonMisspellings = {
    "passtime": "pastime",
    "percieve": "perceive",
    //"personel": "personal", // Removed from here
    "possesssion": "possession",
    "potatos": "potatoes",
};

const contextMisspellings = {
    "personel": (words, index) => {
        const personnelKeywords = [
            "management", "department", "file", "files", "record", "records", "military", "army", "navy",
            "office", "staff", "human", "resource", "resources", "security", "services", "division",
            "administration", "policy", "training", "hiring", "recruitment", "employee", "employees",
            "employer", "worker", "job", "career", "authorized", "only", "medical", "file", "files"
        ];

        // words is already array of lowercased strings
        const isPersonnelContext = words.some((w, i) => {
             const cleaned = w.replace(/[.,!?;:"']/g, '').toLowerCase();
             return i !== index && personnelKeywords.includes(cleaned);
        });

        return isPersonnelContext ? "personnel" : "personal";
    }
};

function getCorrectedQuery(query) {
    const lowerCaseWords = query.toLowerCase().split(/\s+/);
    const words = query.split(/\s+/);
    let correctedWords = [];
    let hasMisspellings = false;

    words.forEach((word, index) => {
        const cleanedWord = word.replace(/[.,!?;:"']/g, '').toLowerCase();

        let corrected = null;

        if (contextMisspellings[cleanedWord]) {
             corrected = contextMisspellings[cleanedWord](lowerCaseWords, index);
        } else if (commonMisspellings[cleanedWord]) {
             corrected = commonMisspellings[cleanedWord];
        }

        if (corrected) {
            // Casing preservation logic
            if (word.length > 0 && corrected.length > 0 && word[0] === word[0].toUpperCase() && word.slice(1) === cleanedWord.slice(1) ) {
                 corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
            } else if (word === word.toUpperCase() && word.length > 1) {
                corrected = corrected.toUpperCase();
            }

            correctedWords.push(word.replace(new RegExp(cleanedWord, "i"), corrected)); // Rough replacement for test
            hasMisspellings = true;
        } else {
            correctedWords.push(word);
        }
    });

    return hasMisspellings ? correctedWords.join(' ') : query;
}

const testCases = [
    "personel file", // Should be personnel
    "my personel opinion", // Should be personal
    "military personel", // Should be personnel
    "personel belongings", // Should be personal
    "authorized personel only", // Should be personnel
    "personel management", // Should be personnel
    "this is personel", // Default -> personal
    "Teh personel department", // "Teh" -> "The", "personel" -> "personnel"
    "Army Personel", // Should be Army Personnel (case insensitive context)
    "My Personel Opinion", // Should be My Personal Opinion
];

testCases.forEach(test => {
    console.log(`"${test}" -> "${getCorrectedQuery(test)}"`);
});
