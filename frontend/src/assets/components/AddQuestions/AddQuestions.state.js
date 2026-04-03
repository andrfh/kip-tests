export const INITIAL_STATE = {
	isValid: {
		name: true,
		disc: true,
		group: true,
		status: true,
		question: true,
		answer: true,
		score: true,
		time: true,
		max_attempts: true
	},

	values: {
		name: 'Новый билет',
		disc: '',
		group: '',
		status: false,
		question: '',
		answer: '',
		score: '',
		time: '',
		max_attempts: ''
	},

	questions: [],
	
	isFormReadyToSubmit: false
};

export function formReducer(state, action) {
	switch(action.type) {
	case 'SET_VALUE':
		return {...state, values: { ...state.values, ...action.payload}} 
	case 'CLEAR':
		return {... state, values: INITIAL_STATE.values, questions: INITIAL_STATE.questions, isFormReadyToSubmit: false};
	case 'RESET_VALIDITY':
		return {... state, isValid: INITIAL_STATE.isValid};
	case 'SUBMIT': {
		const nameValidity = state.values.name?.trim().length;
		const discValidity = state.values.disc?.trim().length;
		const groupValidity = state.values.group?.trim().length;
		const questionValidity = state.values.question?.trim().length;
		const answerValidity = state.values.answer?.trim().length;
		const scoreValidity = state.values.score?.trim().length;
		const timeValidity = state.values.score?.trim().length;
		const max_attemptsValidity = state.values.max_attempts?.trim().length
		return {
			
			...state,
			isValid: {
				name: nameValidity,
				disc: discValidity,
				group: groupValidity,
				status: true,
				question: questionValidity,
				answer: answerValidity,
				score: scoreValidity,
				time: timeValidity,
				max_attempts: max_attemptsValidity
			},
			isFormReadyToSubmit: max_attemptsValidity && timeValidity && nameValidity && discValidity && groupValidity && questionValidity && answerValidity && scoreValidity
		};
	}
	}
}