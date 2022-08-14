import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CreateQuizLayout } from '../features/quiz';
import { QuizLayout } from '../features/quiz';
import {Home} from "./Home"

export const AppRoutes: React.FC = () => (

    <Routes>
      <Route index element={<Home/>} />

      <Route path="/quiz/leaderboard" element={<p>Leaderboard</p>} />
      <Route path="/quiz/:gameId" element={<QuizLayout/>} />
      <Route path="/quiz/results/:gameId" element={<p></p>} />
      <Route path="/quiz/create" element={<CreateQuizLayout/>} />

    </Routes>
);