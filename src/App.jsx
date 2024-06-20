import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import "./App.css";

// Create a react query client
const queryClient = new QueryClient();

function App() {
    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
            <Home />
        </QueryClientProvider>
    );
}

export default App;
