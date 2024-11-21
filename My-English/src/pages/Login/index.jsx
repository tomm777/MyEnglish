// import { collection, getDocs } from '@firebase/firestore';
// import { useEffect } from 'react';
// import { db } from '../firebase/firebase';

import { getAuth, signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';
import SignInGoogelPopup from '../../firebase/authGoogleSignin';
import { useEffect } from 'react';
import 'firebaseui/dist/firebaseui.css';
import 'firebaseui';
import firebase from 'firebase/compat/app';

const Login = () => {
	const auth = getAuth();
	// const provider = new GoogleAuthProvider();
	console.log(auth);

	// const handleLogin = () => {
	// 	SignInGoogelPopup();
	// };
	useEffect(() => {
		const ui =
			firebaseui.auth.AuthUI.getInstance() ||
			new firebaseui.auth.AuthUI(getAuth());

		const uiConfig = {
			signInSuccessUrl: '/', // 로그인 성공 후 리디렉션할 URL
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				// 다른 제공자를 추가할 수 있습니다.
			],
			signInFlow: 'popup',
		};
		ui.start('#firebaseui-auth-container', uiConfig);
	}, []);
	return (
		<>
			<div className="w-[30rem] mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
					{/* <img
						className="mx-auto h-10 w-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
						alt="My English"
					/> */}
					<h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						로그인이 필요한 서비스입니다.
					</h2>
				</div>
				<div id="firebaseui-auth-container"></div>
				<div className="text-center mt-10">
					{/* <button
						onClick={handleLogin}
						className="font-medium h-auto leading-normal max-w-[240px] min-h-[40px] p-2 px-4 text-left w-full bg-gray-200/20 shadow-md text-center"
						data-provider-id="google.com"
						style={{ backgroundColor: '#ffffff' }}
						data-upgraded=",MaterialButton"
					>
						<img
							className="w-5 h-5 inline-block mr-5 align-middle"
							alt="GOOGLE"
							src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
						/>
						<span className="text-lg text-gray-700 font-medium align-middle">
							Sign in with Google
						</span>
					</button> */}
					{/* <div className="mt-10 mb-10"></div> */}
					{/* <button
						className=" bg-gray-200/20 shadow-md dir-ltr font-medium h-auto  leading-normal max-w-[240px] min-h-[40px] p-2 px-4 text-left w-full  text-center"
						style={{ backgroundColor: '#db4437' }}
					>
						<img
							className="w-6 h-5 inline-block mr-5 align-middle"
							alt=""
							src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg"
						/>
						<span className="text-lg text-white font-medium align-middle">
							Sign in with email
						</span>
					</button> */}
				</div>
				{/* <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" action="#" method="POST">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								ID
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Password
								</label>
								<div className="text-sm"></div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="mt-10 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								로그인
							</button>
						</div>
					</form>
				</div> */}
			</div>
		</>
	);
};
export default Login;
