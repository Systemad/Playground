import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Lobby } from '../features/lobby/routes/Lobby';
import { QuizLayout } from '../features/quiz';
import { QuizHome } from '../features/quiz/routes/QuizHome';

export const AppRoutes: React.FC = () => (

  <Routes>
    <Route index element={<Lobby />} />

    <Route path='/quiz' element={<QuizHome />} />
    <Route path='/quiz/:gameId' element={<QuizLayout />} />
    <Route path='/quiz/results/:gameId' element={<p></p>} />

  </Routes>
);