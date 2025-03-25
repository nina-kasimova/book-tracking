const MyListsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="my-lists-layout">
            <main className="p-4">
                {children}
            </main>
        </div>
    );
};

export default MyListsLayout;