import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo/logo-large.png";
import logoName from "@/assets/logo/long-logo.png";
import SpotifyIcon from "@/assets/icon/spotify-icon.svg?react";
import { useAuthStore } from "@/stores/authStore";
import { usePostData } from "@/hooks/useApi";

// 쿼리 파라미터 가져오기
async function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("code") && !urlParams.has("error")) return null;

  return {
    code: urlParams.get("code"),
    state: urlParams.get("state"),
    error: urlParams.get("error"),
  };
}

export default function Login() {
  const navigate = useNavigate();
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID!;
  const REDIRECT_URI = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_SPOTIFY_REDIRECT_URL;
  const { setSpotifyAuthState, removeSpotifyAuthState, spotifyAuthState, setAccessToken } =
    useAuthStore();

  const { mutateAsync: login } = usePostData("/auth/login");

  const exchangeCodeForToken = useCallback(
    async (code: string) => {
      const body = {
        code: code,
        isLocal: import.meta.env.VITE_IS_LOCAL,
      };

      try {
        const response = await login(body);
        if (!response) {
          throw new Error("토큰 교환 실패");
        }
        return response;
      } catch (error) {
        throw new Error("토큰 교환 실패");
      }
    },
    [login]
  );

  // Spotify 로그인
  const handleSpotifyLogin = () => {
    const STATE = generateRandomString(16);
    const SCOPE =
      "user-read-private user-read-email user-read-recently-played user-read-private user-modify-playback-state user-read-playback-state streaming";

    setSpotifyAuthState(STATE);

    window.location.href =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
        state: STATE,
      }).toString();
  };

  // 랜덤 문자열 생성
  const generateRandomString = (length: number) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  useEffect(() => {
    async function handleCallback() {
      // 쿼리 파라미터 체크 (Authorization Code Flow)
      const queryParams = await getQueryParams();
      if (!queryParams) return;

      if (queryParams.error) {
        window.alert(`인증 오류: ${queryParams.error}`);
        return;
      }

      if (queryParams.state !== spotifyAuthState) {
        window.alert("상태 불일치 오류가 발생했습니다. 다시 로그인 해주세요.");
        return;
      }

      if (queryParams.code) {
        try {
          const tokenData = await exchangeCodeForToken(queryParams.code);
          const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: `Bearer ${tokenData.data.spotify_accessToken}`,
            },
          });
          const userData = await response.json();

          const newTokenData = {
            access_token: tokenData.data.accessToken,
            refresh_token: tokenData.data.spotify_refreshToken,
            spotify_access_token: tokenData.data.spotify_accessToken,
            expires_at: Date.now() + 3600 * 1000,
            product: userData.product,
          };
          removeSpotifyAuthState();
          setAccessToken(
            newTokenData.access_token,
            newTokenData.refresh_token,
            newTokenData.expires_at,
            newTokenData.spotify_access_token,
            newTokenData.product
          );
          window.history.replaceState(null, "", window.location.pathname);
          navigate("/home");
        } catch (error) {
          window.alert("서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    }

    handleCallback();
  }, [exchangeCodeForToken, navigate, spotifyAuthState, removeSpotifyAuthState, setAccessToken]);

  return (
    <div className="flex flex-col max-w-[560px] m-[20px] h-screen items-center justify-center">
      <div className="bg-level2 rounded-full max-h-[40vh] max-w-[calc(80%-40px)] w-auto h-auto aspect-square p-2 flex items-center justify-center">
        <img className="w-full h-full object-contain" src={logo} alt="로고" />
      </div>
      <img className="max-w-7/12 max-h-[1h] w-auto mt-[3vh]" src={logoName} alt="로고이름" />
      <button
        className="flex w-[calc(90vw-40px)] max-w-[500px] min-w-[248px] h-[70px] mt-[20vh] px-2 items-center bg-main rounded-lg"
        onClick={handleSpotifyLogin}
      >
        <SpotifyIcon className="w-[45px] h-[45px] pt-1 flex-shrink-0" />
        <span className="flex-1 text-white text-[20px] xs:text-[24px] font-bold text-center cursor-pointer">
          Spotify 로그인
        </span>
      </button>
    </div>
  );
}
