// import {
// 	getAuth,
// 	signInWithPopup,
// 	GoogleAuthProvider,
// 	signOut,
// } from 'firebase/auth';

// const SignInGoogelPopup = () => {
// 	const auth = getAuth();
// 	const provider = new GoogleAuthProvider();

// 	signInWithPopup(auth, provider)
// 		.then(result => {
// 			const credential = GoogleAuthProvider.credentialFromResult(result);
// 			const token = credential.accessToken;
// 			const user = result.user;
// 		})
// 		.catch(error => {
// 			// Handle Errors here.
// 			const errorCode = error.code;
// 			const errorMessage = error.message;
// 			// The email of the user's account used.
// 			const email = error.customData.email;
// 			// The AuthCredential type that was used.
// 			const credential = GoogleAuthProvider.credentialFromError(error);
// 			// ...
// 		});
// };
// export default SignInGoogelPopup;
