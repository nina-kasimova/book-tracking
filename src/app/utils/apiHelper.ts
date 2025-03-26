export function handleApiError(error: any, setError: (message: string) => void) {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                setError("List name already exists. Try a different name.");
                break;
            case 422:
                setError("Invalid list name. Please enter a valid one.");
                break;
            default:
                setError("Failed to complete the request. Please try again.");
                break;
        }
    } else {
        setError("Network error. Please check your connection.");
    }
}
