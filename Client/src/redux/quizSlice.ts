import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GameStatus } from '../features/game-browser/api/lobbyAPI';
import { QuizSettings } from '../features/quiz/api/quizAPI';
import { RootState } from '../providers/store';

export type PlayerStateDto = {
    id: string;
    name: string;
    score: number;
    answered?: boolean;
    answeredCorrectly?: boolean | undefined;
};

export type QuizRuntime = {
    gameId: string;
    gameStatus: GameStatus;
    numberOfQuestions: string;
    timout: number;
    ownerId: string;
    settings: QuizSettings;
    scoreboard: PlayerStateDto[];
};
type QuizState = {
    runtime: QuizRuntime | undefined;
};

const initialState: QuizState = {
    runtime: undefined,
};

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        leaveGame: (state) => {
            state.runtime = undefined;
        },
        setGame: (state, action: PayloadAction<QuizRuntime>) => {
            state.runtime = action.payload;
        },
        setGameStatus: (state, action: PayloadAction<GameStatus>) => {
            if (state.runtime) state.runtime.gameStatus = action.payload;
        },
        updateScoreboard: (state, action: PayloadAction<PlayerStateDto[]>) => {
            if (state.runtime) state.runtime.scoreboard = action.payload;
        },
    },
});

export const { leaveGame, setGame, setGameStatus, updateScoreboard } =
    quizSlice.actions;

export const selectGame = (state: RootState) => state.quizSlice;

export default quizSlice.reducer;
