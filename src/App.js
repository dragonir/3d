import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home/index';
import City from './containers/City/index';
import Earth from './containers/Earth/index';
import EarthDigital from './containers/EarthDigital/index';
import Demo from './containers/Demo/index';
import Lunar from './containers/Lunar/index';
import Cell from './containers/Cell/index';
import Car from './containers/Car/index';
import Zelda from './containers/Zelda/index';
import Metaverse from './containers/Metaverse/index';
import SegmentFault from './containers/SegmentFault/index';
import Diamond from './containers/Diamond/index';
import Human from './containers/Human/index';
import Olympic from './containers/Olympic/index';
import Comic from './containers/Comic/index';
import Live from './containers/Live/index';
import Floating from './containers/Floating/index';
import Heart from './containers/Heart/index';
import Ring from './containers/Ring/index';
import Scroll from './containers/Scroll/index';
import Ocean from './containers/Ocean/index';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={ <Home /> } path="/" />
          <Route element={ <City /> } path="/city" />
          <Route element={ <Earth /> } path="/earth" />
          <Route element={ <EarthDigital /> } path='earthDigital' />
          <Route element={ <Demo /> } path="/demo" />
          <Route element={ <Lunar /> } path="/lunar" />
          <Route element={ <Cell /> } path="/cell" />
          <Route element={ <Car /> } path="/car" />
          <Route element={ <Zelda /> } path="/zelda" />
          <Route element={ <Metaverse /> } path="/metaverse" />
          <Route element={ <SegmentFault /> } path="/segmentfault" />
          <Route element={ <Diamond /> } path="/diamond" />
          <Route element={ <Human /> } path="/human" />
          <Route element={ <Olympic /> } path="/olympic" />
          <Route element={ <Comic /> } path="/comic" />
          <Route element={ <Live /> } path="/live" />
          <Route element={ <Floating /> } path="/floating" />
          <Route element={ <Heart /> } path="/heart" />
          <Route element={ <Ring /> } path="/ring" />
          <Route element={ <Scroll /> } path="/scroll" />
          <Route element={ <Ocean /> } path="/ocean" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
