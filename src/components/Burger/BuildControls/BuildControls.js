import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const buildControls = (props) =>{

    const controls = [
        {label: "Salad", type: "salad"},
        {label: "Meat", type: "meat"},
        {label: "Cheese", type: "cheese"},
        {label: "Bacon", type: "bacon"}
    ]
    return(
        <div className={classes.BuildControls}>
            <p>Current Price: <strong>{props.price}</strong> </p>
            {controls.map(ctrl => (
                <BuildControl 
                    key={ctrl.label} 
                    label={ctrl.label}
                    added = {() => props.ingredientsAdded(ctrl.type)}
                    removed = {() => props.ingredientRemoved(ctrl.type)}
                    disabled = {props.disabled[ctrl.type]}
                />
            ))}

            <button 
                className={classes.OrderButton}
                disabled = {!props.purchasable}
                onClick={props.purchasing}> {props.isAuth ? 'ORDER NOW' : 'SIGNUP FOR ORDER' } </button>
        </div>
    )
};

export default buildControls;