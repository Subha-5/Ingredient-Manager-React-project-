import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import useHTTP from '../../hooks/http';

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

  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHTTP()

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

      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

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