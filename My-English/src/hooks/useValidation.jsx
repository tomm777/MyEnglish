// hooks/useFocusOutValidation.js
import { useState, useRef } from 'react';

const useFocusOutValidation = validationRegex => {
	const [isCheck, setIsCheck] = useState(false);
	const ref = useRef(null);

	const handleFocusOut = () => {
		if (!validationRegex.test(ref.current.value)) {
			setIsCheck(true);
			ref.current.focus();
		} else {
			setIsCheck(false);
		}
	};

	return [ref, isCheck, handleFocusOut];
};

export default useFocusOutValidation;
