export interface BookRecommendation {
    title: string;
    author: string;
    genre: string;
    description: string;
    reason: string;
    goodreads: string;
}

export const prompt_template = (books: string) => {
    return `I want you to generate book recommendations in JSON format given that i liked the following books before: ${books}. " +
    "The recommendations should include books with similar themes, writing styles, or emotional depth. Ensure the response follows this exact JSON structure:" +
    "[ {title: 'Book Title', author: 'Book Author', genre: 'Book Genre', description: 'Book Description', reason: 'Reason why you'll like it', goodreads: 'Goodreads Link'}, ... ]`;
}