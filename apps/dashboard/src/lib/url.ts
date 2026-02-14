export const getApiUrl = (): string => {
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }

  const url = import.meta.env.VITE_PUBLIC_API_URL;

  console.log(`URL: ${url}`);

  if (url) {
    return url;
  }
  return window.location.origin;
};

export const getDashboardUrl = (): string => {
  console.log(window.location);
  return window.location.origin;
};
