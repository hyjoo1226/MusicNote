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
      setAccessToken: (
        accessToken: string,
        refresh_token: string,
        expiresAt: number,
        spotifyAccessToken: string
      ) => set({ accessToken, refresh_token, expiresAt, spotifyAccessToken }),
      removeAccessToken: () => set({ accessToken: null, expiresAt: null }),
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

            const data = await response.json();

            if (data.status === 200 && data.data) {
              set({
                spotifyAccessToken: data.data.spotify_access_token,
                // 토큰 갱신 시 만료 시간도 갱신 (1시간)
                expiresAt: Date.now() + 3600 * 1000,
              });
              return true;
            }
          } catch (error) {
            console.error("토큰 갱신 중 오류 발생:", error);
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
