import React, { useState, useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get there!')
  }
}

const Ingredients = () => {

  const initialIngrdients = []
  const [ingredients, dispatch] = useReducer(ingredientReducer, initialIngrdients)

  // const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // No need for useEffect to fetch ingredients in this Component
  // since Search Component is already fetching it in the first initial render

  useEffect(() => {
    console.log('RENDERING INGREDIENTS ... ', ingredients)
  }, [ingredients])


  const addIngredientHandler = (ingredient) => {
    setIsLoading(true)
    fetch('https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false)
      return response.json()
    }).then(responseData => {
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    }).catch(error => {
      setError("Something went wrong!")
      setIsLoading(false)
    })
  }

  const removeIngredientHandler = (ingredientID) => {
    setIsLoading(true)
    fetch(`https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`, {
      method: 'DELETE',
    }).then(response => {
      setIsLoading(false)
      dispatch({type: 'DELETE', id: ingredientID})
    }
    ).catch(error => {
      setError("Something went wrong!")
      setIsLoading(false)
    })
  }

  const filteredIngredientsHandler =
    useCallback(
      filteredIngredients =>
        dispatch({ type: 'SET', ingredients: filteredIngredients })
      , [])

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="App">

      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search
          onLoadIngredients={filteredIngredientsHandler}
        />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
