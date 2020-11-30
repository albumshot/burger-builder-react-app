import React,{ Component } from 'react';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {checkValidFormHandler} from '../../shared/utility';

class Auth extends Component {

    state ={
        controls: {
            email: {
                elementType: 'input',
                elementConfig:{
                    type: 'email',
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

            password: {
                elementType: 'input',
                elementConfig:{
                    type: 'password',
                    placeholder: 'Enter Your Password'
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        },
        isSignUp: true
    }

    componentDidMount(){
        if(!this.props.building && this.props.authRedirectPath !== '/'){
            this.props.onAuthRedirectPath()
        }
    }

    inputChangeHandler = (event,controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: 
            {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: checkValidFormHandler(event.target.value,this.state.controls[controlName].validation),
                touched: true
            }
        }

        this.setState({controls: updatedControls})

    }

    submitHandler = (event) => {
        event.preventDefault();

        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignUp);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState =>{
            return{
                isSignUp: !prevState.isSignUp
            }
        })
    }

    render(){

        let formElements = [];

        for(let key in this.state.controls){
            formElements.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        let form = formElements.map(ele => (
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
        ))

            if(this.props.loading){
                form = <Spinner />
            }

            let errorMessage = null;

            if(this.props.error){
                errorMessage = (
                    <p>{this.props.error.message}</p>
                    )
            }

            let authRedirect = null;
            if(this.props.isAuthenticated){
                authRedirect = <Redirect to={this.props.authRedirectPath} />
            }

        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType = 'Success'>SUBMIT</Button>
                </form>
                <Button btnType="Danger" clicked = {this.switchAuthModeHandler} >SWITCH TO {this.state.isSignUp ? 'SIGNIN': 'SIGNUP'}</Button>
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burger.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email,password,signup) => dispatch(actions.auth(email,password,signup)),
        onAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);