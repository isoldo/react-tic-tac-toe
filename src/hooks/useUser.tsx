import { getCookie } from  "typescript-cookie";
import { UserToken } from "../types";

export function useUser(): UserToken {
  const cookie = getCookie("login");
  if (cookie) {
    try {
      const { id, token } = JSON.parse(cookie);
      return { id, token };
    } catch (e) {
      console.error({error: e});
    }
  }

  return { id: null, token: null };
}
