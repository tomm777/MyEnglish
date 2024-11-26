const InputValidation = {
	en: /^[ a-zA-Z]+$/,
	kr: /^[0-9 ,가-힣]+$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	password: /^.{6,}$/,
};
export default InputValidation;
