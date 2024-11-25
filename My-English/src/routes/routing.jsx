import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages';
import Test from '../pages/Test';
import WordsSet from '../pages/WordsSet';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Modal from '../components/Modal';
import PrivateRoute from './privateRoute';
import PublicRoute from './publicRoute';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<PrivateRoute>
				<Layout />
			</PrivateRoute>
		),
		children: [
			{
				path: '',
				element: <Home />,
			},
			{
				path: '/test',
				element: <Test />,
			},
			{
				path: '/wordsset',
				element: <WordsSet />,
			},
		],
	},
	{
		path: '/login',
		element: (
			<PublicRoute>
				<Login />
			</PublicRoute>
		),
	},
	{
		path: '/signup',
		element: (
			<PublicRoute>
				<SignUp />
			</PublicRoute>
		),
	},
]);

export default router;
