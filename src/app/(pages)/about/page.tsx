export default function About() {
    return (
        <div>
            <div className={"mb-10"}>
                <h1 className="text-lg font-semibold text-primary">Main idea</h1>
                <ul className="text-primary-content">
                    <li>Solve the problem of selecting the next book to read</li>
                    <li>Requires access to book content -&gt; hard to achieve or illegal</li>
                    <li>Analyse the book content for what I like about it: theme, characters, language style</li>
                    <li>Find an API that has access to book contents?</li>
                    <li>Read a book, add it to tracker, upload its contents (cos then legal), implement an algorithm to perform sentiment analysis on it, spit out useful information like general sentiment, emotions change of each chapter, character analysis</li>
                    <li>Track the same for user’s previous books and compare, say how it fits what you normally like</li>
                    <li>Allow sorting by sentiment, or topic, or protagonists</li>
                    <li>Predict emotional response of the reader according to the book analysis</li>
                    <li>Do the same with the writing style, language used</li>
                </ul>
            </div>
            <p>Changing themes and colours is here <a href={"https://daisyui.com/"} className="text-accent">daisyui.com/</a></p>
            <p>General tailwind styles <a href={"https://tailwindcss.com/docs/flex-basis"} className="text-accent">tailwindcss.com</a></p>

        </div>
    );
}
