import {Navigate, Outlet, useLocation} from "react-router-dom";
import Cookies from "js-cookie";

const RequireAuth = () => {
    const username = Cookies.get("USERNAME");
    const location = useLocation();

    return username ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace/>
};
export default RequireAuth
