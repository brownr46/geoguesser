import { useHistory } from 'react-router-dom';
import FirebaseContext from '../Firebase/context';
import { useContext, useState, useEffect } from 'react';
import Signup from '../Signup';
import Leaderboard from '../Leaderboard';

function EndGame() {
    const history = useHistory();
    const score = history.location.state?.score;
    const firebase = useContext(FirebaseContext);
    const [currentUser, setCurrentUser] = useState(firebase.auth.currentUser);
    const [poke, setPoke] = useState(0);

    useEffect(() => {
        let unsub = firebase.auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        })

        return function cleanup() {
            unsub();
        }
    }, [firebase.auth]);

    const callback = () => {
        setPoke(1);
    }

    return (
        <div className="section">
            <div className="has-text-centered">
                {currentUser ? <h1>Game over! Your score was {score}</h1>: <h1>Game over! To save your score of {score}, sign up below: </h1>}
            </div>
            {currentUser ? null : <Signup callback={callback} score={score} />}
            <Leaderboard poke={poke} />
        </div>
    )
}

export default EndGame;