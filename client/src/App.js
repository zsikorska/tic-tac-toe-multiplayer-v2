import {BrowserRouter, Route, Routes} from "react-router-dom";
import Game from "./Game";
import Home from "./Home";
import History from "./History";
import Unauthorized from "./Unauthorized";
import Missing from "./Missing";
import Dashboard from "./Dashboard";
import RequireAuth from "./util/RequireAuth";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route element={<RequireAuth />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/game" element={<Game />} />
                </Route>

                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path={"*"} element={<Missing />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
