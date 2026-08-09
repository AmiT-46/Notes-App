import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export function SearchBar({ onSearchNote, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleOnChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      handleClearSearch();
      return;
    }

    debounceRef.current = setTimeout(() => onSearchNote(value), 250);
  };

  const onClearSearch = () => {
    clearTimeout(debounceRef.current);
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="search-bar">
      <FiSearch className="search-bar__icon" aria-hidden="true" />
      <input
        type="search"
        placeholder="Search your notes"
        className="search-bar__input"
        value={searchQuery}
        onChange={handleOnChange}
        aria-label="Search notes"
      />
      {searchQuery && <button className="search-bar__clear" type="button" onClick={onClearSearch} aria-label="Clear search"><FiX aria-hidden="true" /></button>}
    </div>
  );
}
