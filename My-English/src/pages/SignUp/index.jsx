import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useFocusOutValidation from '../../hooks/useValidation';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';

const SignUp = () => {
	const [emailRef, isEmailCheck, handleEmailFocusOut] =
		useFocusOutValidation();
	const [nameRef, isNameCheck, handleNameFocusOut] = useFocusOutValidation();
	const [passwordRef, isPasswordCheck, handlePasswordFocusOut] =
		useFocusOutValidation();
	const navigate = useNavigate();
	const [capsLockOn, setCapsLockOn] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [password, setPassword] = useState('');
	const [isConfirmPasswordCheck, setIsConfirmPasswordCheck] = useState(false);

	// CapsLock 상태 감지
	const handleCapsLock = e => {
		setCapsLockOn(e.getModifierState('CapsLock'));
	};
	useEffect(() => {
		if (confirmPassword && password !== confirmPassword) {
			setIsConfirmPasswordCheck(true);
		} else {
			setIsConfirmPasswordCheck(false);
		}
	}, [password, confirmPassword]);

	const handleSubmit = async e => {
		e.preventDefault();

		if (isEmailCheck || isNameCheck || isConfirmPasswordCheck) {
			return;
		}
		try {
			const auth = getAuth();
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				emailRef.current.value,
				password,
				nameRef.current.value,
			);

			// Firestore에 사용자 정보 저장
			const userRef = doc(db, 'users', userCredential.user.uid);
			await setDoc(userRef, {
				email: emailRef.current.value,
				name: nameRef.current.value,
				createdAt: serverTimestamp(),
			});
			alert('성공적으로 가입되었습니다.');
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<>
			<div className="bg-gray-50 dark:bg-gray-900">
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
					<a
						href="#"
						className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
					>
						<img
							className="w-8 h-8 mr-2"
							src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
							alt="logo"
						/>
						My English
					</a>
					<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
								회원가입
							</h1>
							<form
								className="space-y-4 md:space-y-6"
								onSubmit={handleSubmit}
							>
								<div>
									<label
										htmlFor="email"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										이메일을 입력하세요
									</label>
									<input
										type="email"
										name="email"
										ref={emailRef}
										onBlur={handleEmailFocusOut}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="name@company.com"
										required
									/>
									{isEmailCheck && (
										<p className="mt-2 text-sm text-red-600 dark:text-red-500">
											<span className="font-medium">
												이메일을 올바르게 입력하세요.
											</span>
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="name"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										이름을 입력하세요
									</label>
									<input
										type="name"
										ref={nameRef}
										onBlur={handleNameFocusOut}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="홍길동"
										required
									/>
									{isNameCheck && (
										<p className="mt-2 text-sm text-red-600 dark:text-red-500">
											<span className="font-medium">
												한글을 올바르게 입력하세요.
											</span>
										</p>
									)}
								</div>
								<div className="relative">
									<label
										htmlFor="password"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Password
									</label>
									<input
										type="password"
										name="password"
										value={password}
										onKeyUp={handleCapsLock}
										onChange={e =>
											setPassword(e.target.value)
										}
										onBlur={handlePasswordFocusOut}
										ref={passwordRef}
										placeholder=""
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
									{capsLockOn && (
										<div className="absolute inset-y-0 right-0 flex items-center pr-3 pt-7  pointer-events-none">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-7 w-7 text-yellow-500"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									)}
									{isPasswordCheck && (
										<p className="mt-2 text-sm text-red-600 dark:text-red-500">
											<span className="font-medium">
												비밀번호는 6자 이상이어야
												합니다.
											</span>
										</p>
									)}
									{/* {capsLockOn && (
										<p className="mt-2 text-sm text-yellow-600">
											Caps Lock이 켜져 있습니다
										</p>
									)} */}
								</div>

								<div className="relative">
									<label
										htmlFor="confirmPassword"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Confirm password
									</label>
									<input
										type="password"
										name="confirmPassword"
										id="confirmPassword"
										value={confirmPassword}
										onChange={e =>
											setConfirmPassword(e.target.value)
										}
										onKeyUp={handleCapsLock}
										placeholder=""
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
									{capsLockOn && (
										<div className="absolute inset-y-0 right-0 flex items-center pr-3 pt-7 pointer-events-none">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-7 w-7 text-yellow-500"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									)}
								</div>
								{isConfirmPasswordCheck && (
									<p className="mt-2 text-sm text-red-600 dark:text-red-500">
										<span className="font-medium">
											비밀번호가 일치하지 않습니다.
										</span>
									</p>
								)}

								<button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
									Create an account
								</button>
								<p className="text-sm font-light text-gray-500 dark:text-gray-400">
									이미 계정이 있으신가요?
									<a
										href="/login"
										className="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-1"
									>
										로그인
									</a>
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignUp;
