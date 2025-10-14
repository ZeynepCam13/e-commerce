import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/store";

export default function AdminGuard() {
  const { user } = useAppSelector((state) => state.account);

  // Kullanıcı yoksa veya admin değilse login'e yönlendir
  if (!user || !user.role?.includes("Admin")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
