import { INJURY_BUTTON_PRESSED } from './types';

export const InjuryButtonPressed = text => {
	return {
		type: INJURY_BUTTON_PRESSED,
		payload: text
	};
};