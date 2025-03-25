const MyListsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="my-lists-layout">
            <header className="bg-primary p-4 text-white">
                <h1>My Lists</h1>
            </header>
            <main className="p-4">
                {children}
            </main>
        </div>
    );
};

export default MyListsLayout;