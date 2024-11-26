// hooks/useFocusOutValidation.js
import { useState, useRef } from 'react';
import InputValidation from '../constant/regex';

const useFocusOutValidation = () => {
	const [isCheck, setIsCheck] = useState(false);
	const ref = useRef(null);

	const handleCheckReset = () => {
		setIsCheck(false);
	};

	const handleFocusOut = () => {
		const value = ref.current.value;
		const name = ref.current.name;

		const validationRules = {
			email: InputValidation.email,
			name: InputValidation.kr,
			word: InputValidation.en,
			meaning: InputValidation.kr,
			password: InputValidation.password,
		};

		if (validationRules[name]) {
			const isValid = validationRules[name].test(value);
			setIsCheck(!isValid);
			if (!isValid) {
				ref.current.focus();
			}
		}
	};

	return [ref, isCheck, handleFocusOut, handleCheckReset];
};

export default useFocusOutValidation;
