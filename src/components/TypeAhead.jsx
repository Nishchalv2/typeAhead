import React, { useEffect, useRef, useState } from "react";

const STATE = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

function TypeAhead() {
  const [query, setQuery] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [state, setState] = useState();
  const cache = useRef({});

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      try {
        setState(STATE.LOADING);
        if (cache.current[query]) {
          setSearchResult(cache.current[query]);
          setState(STATE.SUCCESS);
          return;
        }
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${query}&limit=10`,
          { signal }
        );
        const data = await res.json();
        cache.current[query] = data.products;
        setState(STATE.SUCCESS);
        setSearchResult(data.products);
      } catch (error) {
        if (error.name != "AbortError") {
          setState(STATE.ERROR);
        }
      }
    };

    const timerId = setTimeout(fetchData, 1000);
    return () => {
      abortController.abort();
      clearTimeout(timerId);
    };
  }, [query]);
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {state === STATE.ERROR && <div>Error Occured</div>}
      {state === STATE.LOADING && <div>...Loading</div>}
      {state === STATE.SUCCESS && (
        <ul>
          {searchResult.map((item) => {
            return <li key={item.id}>{item.title}</li>;
          })}
        </ul>
      )}
    </div>
  );
}

export default TypeAhead;
