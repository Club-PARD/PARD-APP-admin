import {BrowserRouter} from "react-router-dom";
import {AppContent} from "./Components/App/AppContent";
import {InterceptorSetup} from "./Components/App/AppIntercepterSetup";

function App() {
    return (
        <BrowserRouter>
            <InterceptorSetup/>
            <AppContent/>
        </BrowserRouter>
    );
}

export default App;
