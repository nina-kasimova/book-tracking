export interface BookRecommendation {
    title: string;
    author: string;
    genre: string;
    description: string;
    reason: string;
    goodreads: string;
}

export const prompt_template = (books: string) => {
    return `Based on the books I liked: ${books}, analyze what kind of themes, moods, and character types I seem to prefer in my reading. " +
    "Then, generate book recommendations that match these preferences. The recommendations should be in JSON format and include books with similar themes, writing styles, or emotional depth. " +
    "Ensure the response follows this exact JSON structure:" +
    "{" +
    "  mood_analysis: 'A short summary of the kind of themes, moods, or character traits I seem to be drawn to.', " +
    "  recommendations: [ " +
    "    {title: 'Book Title', author: 'Book Author', genre: 'Book Genre', description: 'Book Description', reason: 'Reason why I might like it', goodreads: 'a link to that book on goodreads'}" +
    "  ]" +
    "}";`
};