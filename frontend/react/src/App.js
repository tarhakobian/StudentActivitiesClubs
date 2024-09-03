import React from "react";
import {Route, Routes} from "react-router-dom";
import "./App.css";
import Clublist from "./pages/Clublist";
import HomePage from "./pages/HomePage";

function App() {
    return (
        <Routes>
            <Route path="/clublist" element={<Clublist/>}/>
            <Route path="/" element={<HomePage/>}/>
        </Routes>
    );
}

export default App;
