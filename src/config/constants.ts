export const API_BASE_URL = "https://lynkr-backend-3kal.onrender.com";
export const SHORT_URL_PREFIX = "https://lynkr-backend-3kal.onrender.com/";

export const formatShortUrl = (codeOrUrl: string): string => {
  if (!codeOrUrl) return "";
  let sanitized = codeOrUrl.replace(/https?:\/\/lynkr\.ly\/?/g, "https://lynkr-backend-3kal.onrender.com/");
  sanitized = sanitized.replace(/^lynkr\.ly\/?/g, "https://lynkr-backend-3kal.onrender.com/");
  if (sanitized.includes("lynkr-backend-3kal.onrender.com")) return sanitized;
  const cleanCode = sanitized
    .replace(/^https?:\/\//, "")
    .replace(/^\/+/, "");
  return `https://lynkr-backend-3kal.onrender.com/${cleanCode}`;
};

export const getShortUrl = (code: string): string => formatShortUrl(code);

