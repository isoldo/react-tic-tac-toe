import { getCookie } from  "typescript-cookie";

export function useUser() {
  const cookie = getCookie("login");
  if (cookie) {
    const { id, token } = JSON.parse(cookie);
    console.debug({id, token});
    return { id, token };
  }

  return { id: null, token: null };
}
