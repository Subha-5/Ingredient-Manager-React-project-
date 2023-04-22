import React, { useEffect, useCallback, useReducer } from 'react';

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

const httpReducer = (currentHTTPState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...currentHTTPState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR_ERR':
      return { ...currentHTTPState, error: null }
    default:
      throw new Error('Should not be reached!')
  }
}

const Ingredients = () => {

  const initialIngrdients = []
  const [ingredients, dispatch] = useReducer(ingredientReducer, initialIngrdients)

  const [httpState, dispatchHTTP] = useReducer(httpReducer, { loading: false, error: null })

  // No need for useEffect to fetch ingredients in this Component
  // since Search Component is already fetching it in the first initial render

  useEffect(() => {
    console.log('RENDERING INGREDIENTS ... ', ingredients)
  }, [ingredients])


  const addIngredientHandler = (ingredient) => {
    dispatchHTTP({ type: 'SEND' })
    fetch('https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHTTP({ type: 'RESPONSE' })
      return response.json()
    }).then(responseData => {
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    }).catch(error => {
      dispatchHTTP({ type: 'ERROR', errorMessage: 'Something went wrong!' })
    })
  }

  const removeIngredientHandler = (ingredientID) => {
    dispatchHTTP({ type: 'SEND' })
    fetch(`https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHTTP({ type: 'RESPONSE' })
      dispatch({ type: 'DELETE', id: ingredientID })
    }
    ).catch(error => {
      dispatchHTTP({ type: 'ERROR', errorMessage: 'Something went wrong!' })
    })
  }

  const filteredIngredientsHandler =
    useCallback(
      filteredIngredients =>
        dispatch({ type: 'SET', ingredients: filteredIngredients })
      , [])

  const clearError = () => {
    dispatchHTTP({type: 'CLEAR_ERR'})
  }

  return (
    <div className="App">

      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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