import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home/index';
import City from './containers/City/index';
import Earth from './containers/Earth/index';
import Demo from './containers/Demo/index';
import Lunar from './containers/Lunar/index';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={ <Home /> } path="/" />
          <Route element={ <City /> } path="/city" />
          <Route element={ <Earth /> } path="/earth" />
          <Route element={ <Demo /> } path="/demo" />
          <Route element={ <Lunar /> } path="/lunar" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
