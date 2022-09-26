import { useContext}  from "react";
import { Navigate, Outlet } from "react-router-dom";

import AuthContext from '../store/auth-context';
const ProtectedRoutes = () => {
    const ctx = useContext(AuthContext);
    
    return (ctx.isLoggedIn === true ? <Outlet /> : <Navigate to="/" replace/>)
}
export default ProtectedRoutes;