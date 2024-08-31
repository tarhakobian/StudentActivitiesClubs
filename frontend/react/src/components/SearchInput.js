import React from "react";
import "./SearchInput.css";
import { FaSearch } from "react-icons/fa";

function SearchInput() {
  return (
    <div className="box">
      <div className="container">
        <span className="icon">
          <FaSearch size={25} />
        </span>
        <input type="search" id="search" placeholder="Search..." />
      </div>
    </div>
  );
}

export default SearchInput;
