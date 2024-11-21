import firebase from 'firebase/compat/app';
import { useEffect } from 'react';
const FirebaseAuth = () => {
	useEffect(() => {
		const ui = new firebaseui.auth.AuthUI(auth);
		const uiConfig = {
			signInSuccessUrl: '/', // 로그인 성공 후 리디렉션할 URL
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				// 다른 제공자를 추가할 수 있습니다.
			],
		};
		ui.start('#firebaseui-auth-container', uiConfig);
	}, []);
	return (
		<>
			<h1>Welcome to My Awesome App</h1>
			<div id="firebaseui-auth-container"></div>
		</>
	);
};

export default FirebaseAuth;
// const uiConfig = {
// 	callbacks: {
// 		signInSuccessWithAuthResult: function (authResult, redirectUrl) {
// 			// User successfully signed in.
// 			// Return type determines whether we continue the redirect automatically
// 			// or whether we leave that to developer to handle.
// 			return true;
// 		},
// 		uiShown: function () {
// 			// The widget is rendered.
// 			// Hide the loader.
// 			document.getElementById('loader').style.display = 'none';
// 		},
// 	},
// 	// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
// 	signInFlow: 'popup',
// 	signInSuccessUrl: '<url-to-redirect-to-on-success>',
// 	signInOptions: [
// 		// Leave the lines as is for the providers you want to offer your users.
// 		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
// 		firebase.auth.PhoneAuthProvider.PROVIDER_ID,
// 	],
// 	// Terms of service url.
// 	tosUrl: '<your-tos-url>',
// 	// Privacy policy url.
// 	privacyPolicyUrl: '<your-privacy-policy-url>',
// };

// // Initialize the FirebaseUI Widget using Firebase.
// const ui = new firebaseui.auth.AuthUI(firebase.auth());
// // The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', {
// 	signInOptions: [
// 		{
// 			provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
// 			scopes: ['https://www.googleapis.com/auth/contacts.readonly'],
// 			customParameters: {
// 				// Forces account selection even when one account
// 				// is available.
// 				prompt: 'select_account',
// 			},
// 		},
// 		{
// 			provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
// 			scopes: ['public_profile', 'email', 'user_likes', 'user_friends'],
// 			customParameters: {
// 				// Forces password re-entry.
// 				auth_type: 'reauthenticate',
// 			},
// 		},
// 		//   firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter does not support scopes.
// 		//   firebase.auth.EmailAuthProvider.PROVIDER_ID // Other providers don't need to be given as object.
// 	],
// });
