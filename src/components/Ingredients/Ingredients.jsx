import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import useHTTP from '../../hooks/http';


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

  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier } = useHTTP()

  // No need for useEffect to fetch ingredients in this Component
  // since Search Component is already fetching it in the first initial render

  useEffect(() => {
    if ( !isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra })
    }
    else if ( !isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } })
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error])

  const addIngredientHandler =
    useCallback((ingredient) => {
      // dispatchHTTP({ type: 'SEND' })
      // fetch('https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json', {
      //   method: 'POST',
      //   body: JSON.stringify(ingredient),
      //   headers: { 'Content-Type': 'application/json' }
      // }).then(response => {
      //   dispatchHTTP({ type: 'RESPONSE' })
      //   return response.json()
      // }).then(responseData => {
      //   dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
      // }).catch(error => {
      //   dispatchHTTP({ type: 'ERROR', errorMessage: 'Something went wrong!' })
      // })
      sendRequest(
        'https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      )
    }, [sendRequest])

  const removeIngredientHandler =
    useCallback((ingredientID) => {
      // dispatchHTTP({ type: 'SEND' })
      // fetch(, {
      //   method: ,
      // }).then(response => {
      //   dispatchHTTP({ type: 'RESPONSE' })
      //   dispatch({ type: 'DELETE', id: ingredientID })
      // }
      // ).catch(error => {
      //   dispatchHTTP({ type: 'ERROR', errorMessage: 'Something went wrong!' })
      // })
      sendRequest(
        `https://learn-react-hooks-b2651-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`,
        'DELETE',
        null,
        ingredientID,
        'REMOVE_INGREDIENT'
      )
    }, [sendRequest])

  const filteredIngredientsHandler =
    useCallback(
      filteredIngredients =>
        dispatch({ type: 'SET', ingredients: filteredIngredients })
      , [])

  const clearError = useCallback(() => {
    // dispatchHTTP({ type: 'CLEAR_ERR' })
  }, [])

  const ingredientList =
    useMemo(() => {
      return (
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />)
    }, [ingredients, removeIngredientHandler])

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
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;