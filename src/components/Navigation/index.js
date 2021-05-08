import { Link } from 'react-router-dom';
import FirebaseContext from '../Firebase/context';
import { useContext, useEffect, useState } from 'react';
import Logout from '../Logout';

function Navigation() {
    const firebase = useContext(FirebaseContext);
    const [currentUser, setCurrentUser] = useState(firebase.auth.currentUser);

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        })
    });

    return (
        <div className="navbar is-dark">
            <div className="navbar-start">
                <Link className="navbar-item" to="/">GeoGuesser</Link>
                <Link className="navbar-item" to="/leaderboard">Leaderboard</Link>
            </div>
            { currentUser ? <User /> : <Anon /> }
        </div>
    )
}

const User = () => {
    return (
        <div className="navbar-end">
            <Logout className="navbar-item" />
            {/* <Link className="navbar-item" to="/logout">Log Out</Link> */}
        </div>
    )
}

const Anon = () => {
    return (
        <div className="navbar-end">
            <Link className="navbar-item" to="/signup">Sign Up</Link>
            <Link className="navbar-item" to="/login">Log In</Link>
        </div>
    )
}

export default Navigation;