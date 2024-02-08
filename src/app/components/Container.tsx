export function Container({ children }) {
    return (
        <>
            <div className="container mx-auto mt-10 w-3/4 min-h-screen">
                { children }
            </div>
        </>
    )
}