// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';

const PrivateRoute = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			setAuthUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth]);

	if (loading) {
		return <Loading />;
	}

	if (!authUser) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default PrivateRoute;
