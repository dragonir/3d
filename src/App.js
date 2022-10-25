import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('@/containers/Home/index'));
const City = lazy(() => import('@/containers/City/index'));
const Earth = lazy(() => import('@/containers/Earth/index'));
const EarthDigital = lazy(() => import('@/containers/EarthDigital/index'));
const Demo = lazy(() => import('@/containers/Demo/index'));
const Lunar = lazy(() => import('@/containers/Lunar/index'));
const Cell = lazy(() => import('@/containers/Cell/index'));
const Car = lazy(() => import('@/containers/Car/index'));
const Zelda = lazy(() => import('@/containers/Zelda/index'));
const Metaverse = lazy(() => import('@/containers/Metaverse/index'));
const SegmentFault = lazy(() => import('@/containers/SegmentFault/index'));
const Human = lazy(() => import('@/containers/Human/index'));
const Olympic = lazy(() => import('@/containers/Olympic/index'));
const Comic = lazy(() => import('@/containers/Comic/index'));
const Live = lazy(() => import('@/containers/Live/index'));
const Floating = lazy(() => import('@/containers/Floating/index'));
const Heart = lazy(() => import('@/containers/Heart/index'));
const Ring = lazy(() => import('@/containers/Ring/index'));
const Scroll = lazy(() => import('@/containers/Scroll/index'));
const Ocean = lazy(() => import('@/containers/Ocean/index'));
const Farm = lazy(() => import('@/containers/Farm/index'));
const Mine = lazy(() => import('@/containers/Mine/index'));
const Tennis = lazy(() => import('@/containers/Tennis/index'));
const Shadow = lazy(() => import('@/containers/Shadow/index'));
const Fans = lazy(() => import('@/containers/Fans/index'));
const Gravity = lazy(() => import('@/containers/Gravity/index'));
const RickAndMorty = lazy(() => import('@/containers/RickAndMorty/index'));
const Flag = lazy(() => import('@/containers/Flag/index'));
const ShaderPattern = lazy(() => import('@/containers/ShaderPattern/index'));

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div className='loading_page'>Loading...</div>}>
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
          <Route element={ <Human /> } path="/human" />
          <Route element={ <Olympic /> } path="/olympic" />
          <Route element={ <Comic /> } path="/comic" />
          <Route element={ <Live /> } path="/live" />
          <Route element={ <Floating /> } path="/floating" />
          <Route element={ <Heart /> } path="/heart" />
          <Route element={ <Ring /> } path="/ring" />
          <Route element={ <Scroll /> } path="/scroll" />
          <Route element={ <Ocean /> } path="/ocean" />
          <Route element={ <Farm /> } path="/farm" />
          <Route element={ <Mine /> } path="/mine" />
          <Route element={ <Tennis /> } path="/tennis" />
          <Route element={ <Shadow /> } path="/shadow" />
          <Route element={ <Fans /> } path="/fans" />
          <Route element={ <Gravity />} path="/gravity" />
          <Route element={ <RickAndMorty />} path="/rickAndMorty" />
          <Route element={ <Flag />} path="/flag" />
          <Route element={ <ShaderPattern />} path="/shaderPattern" />
        </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
