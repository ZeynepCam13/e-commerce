import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../store/store";

export default function AuthGuard() {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  if (!user) {
    // Kullanıcı giriş yapmadıysa login sayfasına yönlendir
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Kullanıcı giriş yaptıysa sayfayı (child route’u) göster
  return <Outlet />;
}
