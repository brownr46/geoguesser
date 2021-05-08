import FirebaseContext from '../Firebase/context';
import { useContext, useEffect, useState } from 'react';

function Leaderboard(props) {
    const [first, setFirst] = useState(true);
    const firebase = useContext(FirebaseContext);
    const [scores, setScores] = useState(null);

    useEffect(() => {
        firebase.getScores().then(res => {
            res.sort((a, b) => a[1] - b[1]);
            setScores(res);
        })
        if (first) {
            setTimeout(() => setFirst(false), 500);
        }
    }, [firebase, first, props.poke]);

    return (
        <div className="section">
            <div className="columns is-centered has-text-centered">
                <div className="column is-one-third box">
                    <h1 className="title is-3">Leaderboard</h1>
                    <div className="columns is-centered">
                        <div className="column is-narrow">
                            <table className="table is-striped is-hoverable">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scores?.map((element, i) => (
                                        <tr key={i}>
                                            <td key={i + '0'}>{element[0]}</td>
                                            <td key={i + '1'}>{element[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;