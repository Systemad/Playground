import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { LobbyPage } from '../features/lobby';
import { Quiz, QuizHomePage, QuizResults } from '../features/quiz/';
import { UserPage } from '../features/user';

export const AppRoutes: React.FC = () => (
    <Routes>
        <Route index element={<LobbyPage />} />

        <Route path="/quiz" element={<QuizHomePage />} />
        <Route path="/quiz/:gameId" element={<Quiz />} />
        <Route path="/quiz/:gameId/results" element={<QuizResults />} />

        <Route path="/profile" element={<UserPage />} />
    </Routes>
);
