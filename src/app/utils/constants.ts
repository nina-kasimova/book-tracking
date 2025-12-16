export interface BookRecommendation {
    title: string;
    author: string;
    genre: string;
    description: string;
    reason: string;
    goodreads: string;
}

export const prompt_template = (books: string) => {
    return `
You are an assistant that recommends books based on reading preferences.

Books the user liked:
${books}

Task:
1. Briefly analyze the themes, moods, and character types implied by these books.
2. Recommend books that match these preferences.

Output rules (strict):
- Respond ONLY with a single JSON object inside a markdown code block.
- Do NOT include explanations, headings, or extra text.
- Follow this exact structure:

\`\`\`json
{
  "mood_analysis": "Short summary of themes, moods, or character traits the user prefers.",
  "recommendations": [
    {
      "title": "Book title",
      "author": "Author name",
      "genre": "Genre",
      "description": "Short description",
      "reason": "Why this matches the user's taste",
      "goodreads": "Goodreads URL"
    }
  ]
}
\`\`\`
`;
};
