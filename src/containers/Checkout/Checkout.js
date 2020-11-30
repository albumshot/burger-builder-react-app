import React,{ Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './Contact-Data/Contact-Data';

class Checkout extends Component {

    checkoutContinuedHandler = () =>{
        this.props.history.replace('/checkout/contact-data');
    }

    checkoutCancelledHandler = () =>{
        this.props.history.goBack();
    }

    render(){
        let summary = <Redirect to="/" /> 

        if(this.props.ings){
            const purchaseRedirect = this.props.purchased ? <Redirect to="/" /> : null
            summary = ( 
            <div>
                {purchaseRedirect}
                <CheckoutSummary 
                    ingredients={this.props.ings}
                    checkoutCancelled = {this.checkoutCancelledHandler}
                    checkoutContinued = {this.checkoutContinuedHandler}
                />
                <Route 
                    path={this.props.match.path+"/contact-data"} 
                    component = {ContactData} />
            </div>
            )
        }

        return(
            <div>
                {summary}
            </div>
        )
    }
};

const mapStateToProps = state => {
    return{
        ings: state.burger.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(Checkout);