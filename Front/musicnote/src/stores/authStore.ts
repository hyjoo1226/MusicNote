import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  spotifyAccessToken: string | null;
  expiresAt: number | null;
  spotifyAuthState: string | null;
  refresh_token: string | null;
  setAccessToken: (
    accessToken: string,
    refresh_token: string,
    expiresAt: number,
    spotifyAccessToken: string
  ) => void;
  removeAccessToken: () => void;
  setSpotifyAuthState: (state: string) => void;
  removeSpotifyAuthState: () => void;
  refreshSpotifyToken: () => Promise<boolean>;
  checkAndRefreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refresh_token: null,
      spotifyAccessToken: null,
      expiresAt: null,
      spotifyAuthState: null,
      product: null,
      setAccessToken: (
        accessToken: string,
        refresh_token: string,
        expiresAt: number,
        spotifyAccessToken: string
      ) =>
        set((state) => ({
          ...state,
          accessToken,
          refresh_token,
          expiresAt,
          spotifyAccessToken,
        })),
      removeAccessToken: () =>
        set((state) => ({
          ...state,
          accessToken: null,
          refresh_token: null,
          spotifyAccessToken: null,
          expiresAt: null,
        })),
      setSpotifyAuthState: (state: string) => set({ spotifyAuthState: state }),
      removeSpotifyAuthState: () => set({ spotifyAuthState: null }),

      // refresh 토큰 로직 추가
      refreshSpotifyToken: async () => {
        const state = get();
        if (!state.refresh_token) return false;

        // 현재 시간이 만료 시간 10분(600초) 전보다 크면 refresh
        if (state.expiresAt && Date.now() > state.expiresAt - 600000) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/auth/spotify?refreshToken=${state.refresh_token}`,
              {
                method: "GET",
              }
            );

            if (!response.ok) {
              console.error("토큰 갱신 요청 실패:", response.status, response.statusText);
              return false;
            }

            const responseText = await response.text();
            if (!responseText || responseText.trim() === "") {
              console.error("토큰 갱신 응답이 비어있습니다");
              return false;
            }

            try {
              const data = JSON.parse(responseText);

              if (data.status === 200 && data.data) {
                set({
                  spotifyAccessToken: data.data.spotify_access_token,
                  // 토큰 갱신 시 만료 시간도 갱신 (1시간)
                  expiresAt: Date.now() + 3600 * 1000,
                });
                return true;
              } else {
                console.error("토큰 갱신 응답 형식 오류:", data);
                return false;
              }
            } catch (jsonError) {
              console.error(
                "토큰 갱신 응답 JSON 파싱 오류:",
                jsonError,
                "응답 텍스트:",
                responseText
              );
              return false;
            }
          } catch (error) {
            console.error("토큰 갱신 중 오류 발생:", error);
            return false;
          }
        }
        return false;
      },

      // 토큰 유효성 검사 및 필요시 자동 갱신
      checkAndRefreshToken: async () => {
        const state = get();
        if (!state.expiresAt || !state.refresh_token) return false;

        // 현재 시간이 만료 시간 10분(600초) 전보다 크면 refresh 필요
        if (Date.now() > state.expiresAt - 600000) {
          return await get().refreshSpotifyToken();
        }
        return true; // 토큰이 유효함
      },
    }),
    {
      name: "auth-storage", // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
