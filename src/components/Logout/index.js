import FirebaseContext from '../Firebase/context';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function Logout(props) {
    const firebase = useContext(FirebaseContext);

    return (
        <Link
            to='/'
            onClick={() => firebase.auth.signOut()}
            className={props.className}
        >Sign Out</Link>
    )
}

export default Logout;