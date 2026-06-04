export const extractKeywords = (sentence) => {
  if (!sentence) return [];

  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it',
    'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they',
    'this', 'to', 'was', 'will', 'with', 'who', 'has', 'have', 'he', 'she', 'him', 'her', 'wants', 
    'find', 'people', 'person', 'someone', 'background', 'skills', 'available', 'more', 'than', 
    'week', 'month', 'year', 'look', 'looking', 'show', 'me', 'i', 'want', 'need'
  ]);

  // Remove punctuation and split by spaces
  const words = sentence
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(/\s+/);

  // Filter out stop words
  const keywords = words.filter(word => word.length > 0 && !stopWords.has(word));
  
  return keywords;
};
