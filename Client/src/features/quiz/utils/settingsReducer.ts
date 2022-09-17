import { QuizCreationModel } from '../api/quizAPI';

export enum ActionType {
    CHANGECATEGORY = 'CHANGECATEGORY',
    CHANGEDIFFICULTY = 'CHANGECATEGORY',
}
export type Action = {
    type: ActionType;
    payload: string; // | number to fix amount of qustions
};

export const settingsReducer = (
    state: QuizCreationModel,
    action: Action
): QuizCreationModel => {
    const { type, payload } = action;
    switch (type) {
        case ActionType.CHANGECATEGORY:
            return {
                ...state,
                category: payload,
            };
        case ActionType.CHANGEDIFFICULTY:
            return {
                ...state,
                difficulty: payload,
            };
        default:
            return state;
    }
};
