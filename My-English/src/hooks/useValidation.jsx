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
		if (ref.current.name === 'word') {
			if (ref.current && !InputValidation.en.test(ref.current.value)) {
				setIsCheck(true);
				ref.current.focus();
			} else {
				setIsCheck(false);
			}
		}
		if (ref.current.name === 'meaning') {
			if (ref.current && !InputValidation.kr.test(ref.current.value)) {
				setIsCheck(true);
				ref.current.focus();
			} else {
				setIsCheck(false);
			}
		}
	};

	return [ref, isCheck, handleFocusOut, handleCheckReset];
};

export default useFocusOutValidation;
