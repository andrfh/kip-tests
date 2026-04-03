export const INITIAL_STATE = {
	isValid: {
		answer: true
	},

	values: {
		answer: ''
	},	
	isFormReadyToSubmit: false
};

export function formReducer(state, action) {
	switch(action.type) {
	case 'SET_VALUE':
		return {...state, values: { ...state.values, ...action.payload}} 
	case 'CLEAR':
		return {... state, values: INITIAL_STATE.values, isFormReadyToSubmit: false};
	case 'RESET_VALIDITY':
		return {... state, isValid: INITIAL_STATE.isValid};
	case 'SUBMIT': {
		const answerValidity = state.values.answer?.trim().length;
		return {
			...state,
			isValid: {
				answer: answerValidity			
            },
			isFormReadyToSubmit: answerValidity
		};
	}
	}
}