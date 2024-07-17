import React, { useContext, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import Contextpage from "../Contextpage";
import { useNavigate } from "react-router-dom";

function Searchbar() {
  const { filteredGenre, fetchSearch, setBackGenre, setGenres } = useContext(Contextpage);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((query) => {
      if (query.trim() !== "") {
        // Use encodeURIComponent instead of slugify
        navigate(`/search/${encodeURIComponent(query.trim())}`);
      } else {
        navigate("/");
      }
    }, 500),
    [navigate]
  );

  const onChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    handleSearch(newValue);
  };

  return (
    <>
      <Helmet>
        <title>하명이의 영화</title>
      </Helmet>

      <div className="w-full bg-gradient-to-r from-orange-500 to-green-500 h-[5rem] md:h-[6rem]">
        <div className="h-full w-full bg-black/30 flex justify-center items-center">
          <input
            type="search"
            name="searchpanel"
            id="searchpanel"
            placeholder="영화 검색"
            className="p-3 w-full mx-10 md:w-[40rem] rounded-xl outline-none"
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}

export default Searchbar;