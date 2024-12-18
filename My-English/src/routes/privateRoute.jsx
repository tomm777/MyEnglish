import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
	const { authUser } = useAuth();

	if (!authUser) {
		return <Navigate to="/login" replace />;
	}

	return children;
};
export default PrivateRoute;
