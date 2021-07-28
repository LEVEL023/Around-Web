import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function Main(props) {

    const {isLoggedIn, handleLoggedIn} = props;

    const showLogin = () => {
        // case1: loggedIn => show home
        return isLoggedIn ?
            <Redirect to="/home" />
            :
            <Login handleLoggedIn={handleLoggedIn}/>
        // case2: not login => show login
    }

    const showHome = () => {
        return isLoggedIn ?
            <Home />
            :
            <Redirect to={'/login'}/>
    }

    return (
        <div>
            <Switch>
                <Route path={"/"} exact render={showLogin}/>
                <Route path={"/login"} render={showLogin}/>
                <Route path={"/register"} component={Register}/>
                <Route path={"/home"} component={showHome}/>
            </Switch>
        </div>
    );
}

export default Main;