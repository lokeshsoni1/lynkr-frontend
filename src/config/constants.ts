export const API_BASE_URL = "https://lynkr-backend-3kal.onrender.com";
export const SHORT_URL_PREFIX = "https://lynkr-backend-3kal.onrender.com/";

export const getShortUrl = (code: string): string => {
  if (!code) return "";
  if (code.startsWith("http://") || code.startsWith("https://")) return code;
  return `${SHORT_URL_PREFIX}${code}`;
};
