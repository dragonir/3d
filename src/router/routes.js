import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../containers/Home/index';
import City from '../containers/City/index';

export default (
  <Routes>
    <Route element={ <Home /> } path="/" />
    <Route element={ <City /> } path="/city" />
  </Routes>
)