import React, {useState} from 'react'; // hooks
import TopBar from './TopBar';
import Main from './Main'
import {TOKEN_KEY} from "../constants";

function App() {
    // use hooks to mimic states
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem(TOKEN_KEY) ? true : false);
    // isLoggedIn is the state
    // setIsLoggedIn is the function to update the state of isLoggedIn
    const loggedIn = token => {
        // store token in local storage
        if(token) {
            localStorage.setItem(TOKEN_KEY, token);
            setIsLoggedIn(true);
        }
    }
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY); // logout the user
        setIsLoggedIn(false);
    }
     return (
        <div className="App">
            <TopBar
                isLoggedIn={isLoggedIn} // whether token is back
                handleLogout={logout}
            />
            <Main handleLoggedIn={loggedIn} isLoggedIn={isLoggedIn}/>
        </div>
  );
}

export default App;
