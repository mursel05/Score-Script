import toast from "react-hot-toast";

export const fetcher = async (url: string, options?: RequestInit, toastError = true) => {
  const res = await fetch("/api" + url, {
    headers: { ...options?.headers, "Content-Type": "application/json" },
    method: options?.method || "GET",
    ...options,
  });
  const data = await res.json();
  if (data.error) {
    if (toastError) {
      toast(data.error);
    }
  }
  return data;
};
