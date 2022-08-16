import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CreateQuiz } from '../features/quiz/routes/CreateQuiz';
import { Quiz } from '../features/quiz/routes/Quiz';
import { Home } from './Home';

export const AppRoutes: React.FC = () => (

  <Routes>
    <Route index element={<Home />} />

    <Route path='/quiz' element={<p>Home</p>} />
    <Route path='/quiz/leaderboard' element={<p>Leaderboard</p>} />
    <Route path='/quiz/:gameId' element={<Quiz />} />
    <Route path='/quiz/results/:gameId' element={<p></p>} />
    <Route path='/quiz/create' element={<CreateQuiz />} />

  </Routes>
);