import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routing';
import Loading from './components/Loading';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {});
	return (
		<Suspense fallback={<Loading />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}

export default App;
