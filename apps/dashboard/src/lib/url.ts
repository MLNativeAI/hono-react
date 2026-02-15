export const getApiUrl = (): string => {
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }

  const url = import.meta.env.VITE_PUBLIC_API_URL || "VITE_PUBLIC_API_URL_PLACEHOLDER";

  console.log(`URL: ${url}`);

  return url;
};

export const getDashboardUrl = (): string => {
  console.log(window.location);
  return window.location.origin;
};
