import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages';
import SignUp from '../pages/SignUp';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
]);

export default router;
