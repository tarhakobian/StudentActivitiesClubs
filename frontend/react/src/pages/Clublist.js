import React from "react";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import ClubsPictures from "../components/ClubsPictures";

function Clublist() {
    return (
        <div>
            <Header/>
            <SearchInput/>
            <ClubsPictures/>
        </div>
    );
}

export default Clublist;
