import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json')
      .then(response => response.json())
      .then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
        }
        setIngredients(loadedIngredients);
      })
  }, [])

  useEffect( () => {
    console.log('RENDERING INGREDIENTS', ingredients)
  }, [ingredients])


  const addIngredientHandler = (ingredient) => {
    fetch('https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json()
    }).then(responseData => {
      setIngredients(prevIngredients =>
        [...prevIngredients,
        { id: responseData.name, ...ingredient }
        ])
    })
  }

  const removeIngredientHandler = (ingredientID) => {
    setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientID))
  }

  const filteredIngredientsHandler = (filteredIngredients) => {
    setIngredients(filteredIngredients);
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
