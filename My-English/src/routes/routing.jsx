import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages';
import SignUp from '../pages/SignUp';
import Home from '../pages';
import Layout from '../components/Layout';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '',
				element: <Home />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
]);

export default router;
