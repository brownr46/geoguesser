import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDs8G3weFIzm87nAhqyCDOs7KF4TcRMSew",
    authDomain: "geoguesser-ca064.firebaseapp.com",
    projectId: "geoguesser-ca064",
    storageBucket: "geoguesser-ca064.appspot.com",
    messagingSenderId: "226612602842",
    appId: "1:226612602842:web:cefc0905593f8092a602e3"
};

export class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
    }
}