import React from 'react';
import classes from './Burger.css';
import BurgerIngredients from './BurgerIngredients/BurgerIngredients';

const burger = (props) =>{

    let transformaedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_,i)=>{
                return <BurgerIngredients key={igKey + i} type={igKey}/>
            });
        })
        .reduce((arr,el) => {
            return arr.concat(el);
        },[]);

        if(transformaedIngredients.length===0){
            transformaedIngredients = <p>Please start adding ingredients!</p>;
        }

    return(
        <div className={classes.Burger}>
            <BurgerIngredients type="bread-top" />
            {transformaedIngredients}
            <BurgerIngredients type="bread-bottom" />
        </div>
    );
}

export default burger;