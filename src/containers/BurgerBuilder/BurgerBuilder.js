import React,{Component} from 'react';
import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as burgerBuilderActions from '../../store/actions/index';
import { connect } from 'react-redux';

// const INGREDIENT_PRICES = {
//     salad: 20,
//     meat: 40,
//     cheese: 30,
//     bacon: 15
// };

class BurgerBuilder extends Component{

    state = {
        purchasing: false
    }

    componentDidMount(){
        this.props.onIngredientInit();
    }

    updatePurchasableState = (ingredients) =>{
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum,el)=>{
                return sum+el
            },0);

            return sum>0;
    }

    purchasingHandler = () =>{
        if(this.props.isAuthenticated){
            this.setState({purchasing: true});
        }
        else{
            this.props.onAuthRedirectPath('/checkout');
            this.props.history.push('/auth')
        }
    }

    purchasingCloseHandler = () =>{
        this.setState({purchasing: false});
    }

    purchasingContniueHandler = () =>{
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render(){
        const disabledInfo = {
            ...this.props.ings
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if(this.props.ings){

            burger = (
                <Aux>
                    <Burger ingredients= {this.props.ings}/>
                    <BuildControls 
                        ingredientsAdded = {this.props.onIngredientAdded}
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        purchasable = {this.updatePurchasableState(this.props.ings)}
                        purchasing = {this.purchasingHandler}
                        disabled = {disabledInfo}
                        price = {this.props.price}
                        isAuth = {this.props.isAuthenticated}
                    />
                </Aux>
            )

            orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            closed = {this.purchasingCloseHandler}
            continued = {this.purchasingContniueHandler}
            price = {this.props.price}/>
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchasingCloseHandler}>
                    {orderSummary}
                </Modal>
                {burger}     
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burger.ingredients,
        price: state.burger.totalPrice,
        error: state.burger.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = disptach => {
    return{
        onIngredientAdded: (ingName) => disptach(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => disptach(burgerBuilderActions.removeIngredient(ingName)),
        onIngredientInit: () => disptach(burgerBuilderActions.initIngredient()),
        onInitPurchase: () => disptach(burgerBuilderActions.purchaseInit()),
        onAuthRedirectPath: (path) => disptach(burgerBuilderActions.setAuthRedirectPath(path))
    }
}

export default  connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));