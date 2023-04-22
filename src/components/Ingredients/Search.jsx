import React, { useState, useEffect, useRef } from 'react';

import useHTTP from '../../hooks/http';

import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(({ onLoadIngredients }) => {

  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()
  const { isLoading, data, error, sendRequest, clear } = useHTTP()

  useEffect(() => {
    const timer = setTimeout(() => {
      const oldEnteredFilterValue = enteredFilter           // inside closure; locked (at value when setTimeout starts)
      const newEnteredFilterValue = inputRef.current.value // outside the closure; not locked
      if (oldEnteredFilterValue === newEnteredFilterValue) {

        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`

        sendRequest(
          'https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json' + query,
          'GET',
        )
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, inputRef, sendRequest])


  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        })
      }
      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients])

  return (
    <section className="search">
    {error && <ErrorModal onClose={clear} ></ErrorModal> }
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
