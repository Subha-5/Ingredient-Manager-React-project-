import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {
  // const {onLoadIngredients} = props
  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      const oldEnteredFilterValue = enteredFilter           // inside closure; locked (at value when setTimeout starts)
      const newEnteredFilterValue = inputRef.current.value // outside the closure; not locked
      if(oldEnteredFilterValue === newEnteredFilterValue){

        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`

        fetch('https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              })
            }
            onLoadIngredients(loadedIngredients)
          })
        }
      }, 500)
      return () => {
        clearTimeout(timer)
      }
  }, [enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
