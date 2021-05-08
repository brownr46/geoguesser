import FirebaseContext from '../Firebase/context';
import { withRouter } from 'react-router-dom';
import { useContext, useState } from 'react';

function Signup(props) {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const firebase = useContext(FirebaseContext);

    const handleChange = (e) => {
        if (e.target.name === "user") {
            setUser(e.target.value);
        } else if (e.target.name === "email") {
            setEmail(e.target.value);
        } else {
            setPass(e.target.value);
        }
    }

    const handleSubmit = () => {
        firebase.auth.createUserWithEmailAndPassword(email, pass).then((usercred) => {
            usercred.user.updateProfile({
                displayName: user
            }).then(() => {
                if (props.score) {
                    firebase.addScore(props.score).then(() => props.callback());
                } else {
                    props.history.push('/');
                }
            })
        }).catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                setEmailError('Email already in use.');
            } else if (error.code === 'auth/invalid-email') {
                setEmailError('Invalid email.');
            } else {
                setPassError('The password is too weak.');
            }
        })
    }

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-one-third box">
                <p className="title">Sign Up</p>
                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control">
                            <input className="input" type="text" name="user" placeholder="Username" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                            <input className="input" type="text" name="email" placeholder="Email" onChange={handleChange} />
                            <p className="help is-danger">{emailError}</p>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input className="input" type="password" name="pass" placeholder="Password" onChange={handleChange} />
                            <p className="help is-danger">{passError}</p>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button disabled={user === '' || email === '' || pass === ''} className="button is-primary" onClick={handleSubmit} >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default withRouter(Signup);