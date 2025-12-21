import api from "./api";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data?.data?.token || res.data?.token || res.data?.data;
  if (!token) throw new Error("No token returned from server");
  if (typeof window !== "undefined")
    localStorage.setItem("mb_admin_token", token);
  return res.data;
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem("mb_admin_token");
}

export function parseJWT(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}
