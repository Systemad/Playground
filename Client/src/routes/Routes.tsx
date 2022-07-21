import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {Home} from "./Home"
import {Lobby} from "./Lobby"

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/lobby" element={<Lobby/>} />
    </Routes>
  </BrowserRouter>
);