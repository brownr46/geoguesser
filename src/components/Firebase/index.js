import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDs8G3weFIzm87nAhqyCDOs7KF4TcRMSew",
    authDomain: "geoguesser-ca064.firebaseapp.com",
    projectId: "geoguesser-ca064",
    storageBucket: "geoguesser-ca064.appspot.com",
    messagingSenderId: "226612602842",
    appId: "1:226612602842:web:cefc0905593f8092a602e3"
};

export default class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.firestore = firebase.firestore();
    }
    
    addScore(score) {
        return this.firestore.collection('leaderboard').doc('leaderboard').get().then(doc => {
            let data = doc.data();
            let scores = data.scores;
            let users = data.users;
            scores.push(score);
            users.push(this.auth.currentUser.displayName);
            this.firestore.collection('leaderboard').doc('leaderboard').set({
                users: users,
                scores: scores
            })
        })
    }

    getScores() {
        return this.firestore.collection('leaderboard').doc('leaderboard').get().then(doc => {
            let data = doc.data();
            let scores = data.scores;
            let users = data.users;
            return users.map((e, i) => [e, scores[i]]);
        })
    }
}
