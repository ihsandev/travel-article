import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Credentials = {
  token: string;
  user: any;
};

export function useCredentials() {
  const [credentials, setCredentials] = useState<Credentials | null>(() => {
    const token = Cookies.get("_token");
    const user = Cookies.get("_user");

    return token && user ? { token, user: JSON.parse(user) } : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const token = Cookies.get("_token");
      const user = Cookies.get("_user");

      if (token && user) {
        setCredentials({ token, user: JSON.parse(user) });
      } else {
        setCredentials(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return credentials;
}
