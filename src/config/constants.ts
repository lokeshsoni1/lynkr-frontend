export const API_BASE_URL = "https://lynkr-backend-3kal.onrender.com";
export const SHORT_URL_PREFIX = "https://lynkr-backend-3kal.onrender.com/";

export const formatShortUrl = (codeOrUrl: string): string => {
  if (!codeOrUrl) return "";
  if (codeOrUrl.includes("lynkr-backend-3kal.onrender.com")) return codeOrUrl;
  const cleanCode = codeOrUrl
    .replace(/^https?:\/\//, "")
    .replace(/^lynkr\.ly\//, "")
    .replace(/^\/+/, "");
  return `https://lynkr-backend-3kal.onrender.com/${cleanCode}`;
};

export const getShortUrl = (code: string): string => formatShortUrl(code);

