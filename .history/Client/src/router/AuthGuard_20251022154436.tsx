import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../store/store";

export default function AuthGuard() {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

// 1️⃣ Eğer kullanıcı yükleniyorsa, hiçbir şey yapma
  if (status === "loading") return null;

  // 2️⃣ Kullanıcı yoksa login'e yönlendir
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // 3️⃣ Kullanıcı varsa sayfayı göster
  return <Outlet />;
}
