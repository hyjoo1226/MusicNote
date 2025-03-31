import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo-large.png";
import logoName from "../assets/logo/long-logo.png";
import SpotifyIcon from "../assets/icon/spotify-icon.svg?react";

// 해시 파라미터 가져오기
async function getHashParams() {
  const hash = window.location.hash.substring(1);
  if (!hash) return null;
  return Object.fromEntries(
    hash.split("&").map((param) => {
      const [key, value] = param.split("=");
      return [key, decodeURIComponent(value)];
    })
  );
}

// 토큰 검증
async function validateToken(params: any, storedState: string | null) {
  if (params.error) {
    throw new Error(`인증 오류: ${params.error}`);
  }
  if (params.state !== storedState) {
    throw new Error("상태 불일치 오류가 발생했습니다");
  }
  if (!params.access_token) {
    throw new Error("액세스 토큰이 없습니다");
  }
  return params;
}

export default function Login() {
  const navigate = useNavigate();
  const [params, setParams] = useState<any | null>(null);
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID!;
  const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URL;

  // Spotify 로그인
  const handleSpotifyLogin = () => {
    const STATE = generateRandomString(16);
    const SCOPE = "user-read-private user-read-email user-read-recently-played user-read-private";

    localStorage.setItem("spotify_auth_state", STATE);

    window.location.href =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "token",
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

  // URL에서 해시 파라미터 가져오기
  useEffect(() => {
    getHashParams().then(setParams);
  }, []);

  const fetchUserProfile = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("프로필 정보를 가져오는데 실패했습니다");
      }

      const profileData = await response.json();
      console.log("사용자 프로필:", profileData);

      // 프로필 데이터만 로컬 스토리지에 저장
      const tokenData = JSON.parse(localStorage.getItem("spotify_token_data") || "{}");
      const updatedTokenData = {
        ...tokenData,
        profile: profileData,
      };
      localStorage.setItem("spotify_token_data", JSON.stringify(updatedTokenData));
    } catch (err) {
      console.error("프로필 요청 오류:", err);
    }
  }, []);

  // 토큰 검증 및 로그인 처리
  useEffect(() => {
    if (!params) return;
    const storedState = localStorage.getItem("spotify_auth_state");

    validateToken(params, storedState)
      .then(() => {
        const newTokenData = {
          access_token: params.access_token,
          token_type: params.token_type,
          expires_in: params.expires_in,
          state: params.state,
        };
        localStorage.setItem("spotify_token_data", JSON.stringify(newTokenData));
        fetchUserProfile(params.access_token);
        localStorage.removeItem("spotify_auth_state");
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/home");
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [params, navigate, fetchUserProfile]);

  return (
    <div>
      <div className="flex flex-col max-w-[560px] m-[20px] items-center justify-center">
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
    </div>
  );
}
