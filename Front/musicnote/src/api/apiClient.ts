import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// 기본 axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  async (config) => {
    // authStore에서 상태와 함수 가져오기
    const authStore = useAuthStore.getState();

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
      const { spotifyAccessToken } = useAuthStore.getState();
      config.headers["Spotify-Access-Token"] = spotifyAccessToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 스포티파이 API용 클라이언트 (필요한 경우)
export const spotifyApiClient = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 스포티파이 API 요청 인터셉터
spotifyApiClient.interceptors.request.use(
  async (config) => {
    // authStore에서 상태와 함수 가져오기
    const authStore = useAuthStore.getState();

    // 스포티파이 토큰이 있으면 만료 시간 확인 및 필요시 갱신
    if (authStore.spotifyAccessToken) {
      // 토큰 만료 시간 확인 및 필요시 갱신
      await authStore.checkAndRefreshToken();

      // 최신 토큰 상태로 헤더 설정
      const { spotifyAccessToken } = useAuthStore.getState();
      if (spotifyAccessToken) {
        config.headers.Authorization = `Bearer ${spotifyAccessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 (선택사항)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 401 에러 발생 시 토큰 갱신 시도
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore.getState();
      const refreshed = await authStore.refreshSpotifyToken();

      // 토큰 갱신에 성공하면 실패한 요청 재시도
      if (refreshed && error.config) {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        }
      }
    }

    return Promise.reject(error);
  }
);
