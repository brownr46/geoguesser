import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from '../Landing'
import Login from '../Login';
import Signup from '../Signup';
import Navigation from '../Navigation';
import EndGame from '../EndGame';
import Leaderboard from '../Leaderboard';
import 'bulma/css/bulma.css'
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document.title = "GeoGuesser";
  })

  return (
    <Router>
      <Navigation />
      <div className="App">
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/endgame" component={EndGame} />
        <Route path="/leaderboard" component={Leaderboard} />
      </div>
    </Router>
  );
}

export default App;
