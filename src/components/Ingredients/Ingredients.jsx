import React, { useState, useEffect, useCallback, Component } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);

  // No need for useEffect to fetch ingredients in this Component
  // since Search Component is already fetching it in the first initial render

  useEffect(() => {
    console.log('RENDERING INGREDIENTS ... ', ingredients)
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
    fetch(`https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`, {
      method: 'DELETE',
    }).then(response =>
      setIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientID)
      )
    )
  }

  const filteredIngredientsHandler =
    useCallback(
      filteredIngredients =>
        setIngredients(filteredIngredients)
      , [])

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
