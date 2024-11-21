import { Suspense, useEffect } from 'react';
import { RouterProvider, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import router from './routes/routing';
import Loading from './components/Loading';

function App() {
	useEffect(() => {
		const auth = getAuth();
		// 상태변화 감지
		onAuthStateChanged(auth, user => {
			if (!user && window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		});
	}, []);

	return (
		<Suspense fallback={<Loading />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}

export default App;
