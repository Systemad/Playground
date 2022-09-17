import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../../providers/store';
import { generateRandomNumber } from '../../../utils/randomNumber';
import { QuizCreationModel } from '../api/quizAPI';

const initialState: QuizCreationModel = {
    name: `Quiz #${generateRandomNumber()}`,
    questions: 10,
    category: '1',
    difficulty: 'easy',
    type: 'multiple',
};

const quizOptionSlice = createSlice({
    name: 'quizOptions',
    initialState,
    reducers: {
        setName(state, action) {
            state.name = action.payload;
        },
        setQuestionAmount(state, action) {
            state.questions = action.payload;
        },
        setCategory(state, action) {
            state.category = action.payload;
        },
        setDifficulty(state, action) {
            state.difficulty = action.payload;
        },
    },
});
export const { setDifficulty, setCategory, setName } = quizOptionSlice.actions;

export const selectQuizOptions = (state: RootState) => state.quizOptionSlice;
export default quizOptionSlice.reducer;
