import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface PrivateRouteProps {
  redirectPath?: string;
}

export default function PrivateRoute({ redirectPath = "/" }: PrivateRouteProps) {
  const { accessToken } = useAuthStore();

  // accessToken이 없으면 리다이렉트
  if (!accessToken) {
    return <Navigate to={redirectPath} replace />;
  }

  // 인증된 경우 자식 라우트 렌더링
  return <Outlet />;
}
