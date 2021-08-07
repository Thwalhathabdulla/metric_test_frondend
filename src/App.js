import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/home';
import {BrowserRouter as Router,Switch,Route,Redirect} from 'react-router-dom';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/Login" component={Login} />
        <Route path="/Register" component={Register} />
        <Route path="/Home" component={Home} />
        <Redirect exact from="/" to="/Home" />
      </Switch>
    </Router>
  );
}

export default App;
