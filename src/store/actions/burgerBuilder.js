import * as actionTypes from '../actions/actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    }
}

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    }
}

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}

export const fetchfailedIngredients = (ingredients) => {
    return {
        type: actionTypes.FETCH_FAILED_INGREDIENTS,
    }
}

export const initIngredient = () => {
    return dispatch => {
        axios.get('https://burger-builder-9023.firebaseio.com/ingredients.json')
            .then(response =>{
                dispatch(setIngredients(response.data))
            })
            .catch(err =>{
                dispatch(fetchfailedIngredients())
            })
    }
}