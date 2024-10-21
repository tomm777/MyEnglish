import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages';
import Test from '../pages/Test';
import WordsSet from '../pages/WordsSet';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Modal from '../components/Modal';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
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
		element: <Login />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
	{
		path: '/modal',
		element: <Modal />,
	},
]);

export default router;
