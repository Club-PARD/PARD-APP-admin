import {BrowserRouter} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AppContent } from "./Components/App/AppContent";
import { InterceptorSetup } from "./Components/App/AppIntercepterSetup";


function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <InterceptorSetup/>
                <AppContent/>
            </BrowserRouter>
        </RecoilRoot>
    );
}

export default App;
