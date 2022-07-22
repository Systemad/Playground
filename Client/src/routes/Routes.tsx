import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {Home} from "./Home"

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
    </Routes>
  </BrowserRouter>
);