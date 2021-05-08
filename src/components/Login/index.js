import FirebaseContext from '../Firebase/context';
import { withRouter } from 'react-router-dom';
import { useContext, useState } from 'react';

function Login(props) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const firebase = useContext(FirebaseContext);

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else {
            setPass(e.target.value);
        }
    }

    const handleSubmit = () => {
        firebase.auth.signInWithEmailAndPassword(email, pass).then(() => {
            props.history.push('/');
        }).catch((error) => {
            setError('Invalid email or password.')
        })
    }

    return (
        <section className="section">
                <div className="columns is-centered">
                    <div className="column is-one-third box">
                        <p className="title">Log In</p>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input className="input" type="text" name="email" placeholder="Email" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input className="input" type="password" name="pass" placeholder="Password" onChange={handleChange} />
                                <p className="help is-danger">{error}</p>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button disabled={email === '' || pass === ''} className="button is-primary" onClick={handleSubmit} >Submit</button>
                            </div>
                        </div>
                    </div>
            </div>
        </section>
    )
}

export default withRouter(Login);