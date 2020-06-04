import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state={
        showSideDrawer: false
    }

    sideDrawerClosed = () =>{
        this.setState({showSideDrawer: false})
    }

    sideDrawerOpened = () =>{
        this.setState( (prevState) =>{
            return {showSideDrawer: !prevState.showSideDrawer}
        } )
        // this.setState({showSideDrawer: true})
    }

    render(){
        return(
            <Aux>
                <Toolbar isAuth = {this.props.isAuthenticated} open={this.sideDrawerOpened}/>
                <SideDrawer isAuth = {this.props.isAuthenticated} open={this.state.showSideDrawer} clicked = {this.sideDrawerClosed}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);