import React,{ Component } from "react";
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import classes from './Contact-Data.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';
import { checkValidFormHandler } from '../../../shared/utility';

class ContactData extends Component{

    state = {
        orderForm:{
            name:{
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Enter Your Name'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            zipcode: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Zipcode'
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 6,
                    maxLength: 6,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Enter Your Email'
                },
                value: '',
                validation:{
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig:{
                    options : [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        isFormValid : false
    }

    orderHandler = (event) =>{
        event.preventDefault();

        const formOrderData = {};

        for(let formElementId in this.state.orderForm){
            formOrderData[formElementId] = this.state.orderForm[formElementId].value;
        }
        
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formOrderData,
            userId: this.props.userId
        }
        
        this.props.onOrderBurger(order,this.props.token);
    }

    inputChangeHandler = (event,inputElement) => {
        const updatedForm = {
            ...this.state.orderForm
        }

        const updatedInputElement = {
            ...this.state.orderForm[inputElement]
        }

        updatedInputElement.value = event.target.value;
        updatedInputElement.valid = checkValidFormHandler(updatedInputElement.value,updatedInputElement.validation);
        updatedInputElement.touched = true;
        updatedForm[inputElement] = updatedInputElement;

        let isFormValid = true;

        for(let inputId in updatedForm){
            isFormValid = updatedForm[inputId].valid && isFormValid;
        }

        this.setState({orderForm: updatedForm, isFormValid: isFormValid})
    }

    render(){

        let formElements = [];

        for(let key in this.state.orderForm){
            formElements.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                    {formElements.map(ele => (
                        <Input
                            key = {ele.id} 
                            elementType = {ele.config.elementType}
                            elementConfig = {ele.config.elementConfig}
                            value = {ele.config.value}
                            invalid = {!ele.config.valid}
                            shouldValidate = {ele.config.validation}
                            touched = {ele.config.touched}
                            elementName = {ele.id}
                            changed = {(event) => this.inputChangeHandler(event,ele.id)}  />
                    ))}
                    <Button btnType="Success" disabled={!this.state.isFormValid}>ORDER</Button>
            </form>
        )
        if(this.props.loading){
            form = <Spinner />
        }

        return(
            <div className={classes.ContactData}>
                <h4>Enter your contact details</h4>
                {form}
            </div>
        )
    }
};

const mapStateToProps = state => {
    return{
        ings: state.burger.ingredients,
        price: state.burger.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData,token) => dispatch(orderActions.purchaseBurger(orderData,token))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));