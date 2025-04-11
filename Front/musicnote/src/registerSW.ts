export const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swPath = import.meta.env.DEV ? "/dev-sw.js?dev-sw" : "/custom-sw.js";

      navigator.serviceWorker
        .register(swPath, { scope: "/" })
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
};
