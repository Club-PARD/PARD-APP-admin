import {BrowserRouter} from "react-router-dom";
import {AppContent} from "./Components/App/AppContent/AppContent";
import {InterceptorSetup} from "./Components/App/AppIntercepterSetup";
import { RecoilRoot } from "recoil";

function App() {
    return (
        <BrowserRouter>
            <RecoilRoot>
                <InterceptorSetup/>
                <AppContent/>
            </RecoilRoot>
        </BrowserRouter>
    );
}

export default App;
