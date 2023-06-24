//Regex
const skipped =
    "to|from|in|on|at|of|a|an|is|are|i|we|you|she|he|it|was|were|do|does|this|those|these|my|his|her|its|him|has|the|have|what|when|where|who|whose|which|how|then|for";
const regex = new RegExp(
    skipped
        .split("|")
        .map((v) => `\\b${v}\\b`)
        .join("|"),
    "g"
);

/**
 * Get keywords
 * @param {String} str
 */
export default function getKeywords(str) {
    const arr = str.toLowerCase()
        .replace(regex, "")
        .replace(/\?|\.|\(|\)|\\|\//g, "")
        .replace(/\s\s+/g, " ")
        .trim()
        .split(" ");
    return [...new Set(arr)]
        
}
