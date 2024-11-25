import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routing';
import Loading from './components/Loading';
import { AuthProvider } from './contexts/AuthContext';

function App() {
	return (
		<AuthProvider>
			<Suspense fallback={<Loading />}>
				<RouterProvider router={router} />
			</Suspense>
		</AuthProvider>
	);
}

export default App;
