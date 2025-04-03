import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { registerSW } from "./registerSW.ts";

registerSW();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: true, // 실패시 재시도 안함
      refetchOnMount: false, // 컴포넌트 마운트시 재요청 안함
      refetchOnWindowFocus: false, // 윈도우 포커스시 재요청 안함
      refetchOnReconnect: false, // 재연결시 재요청 안함
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
