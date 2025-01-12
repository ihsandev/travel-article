import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Credentials = {
  token: string;
  user: any;
};

/**
 * Custom hook to retrieve and manage user credentials from cookies.
 *
 * This hook initializes the credentials state with values from cookies
 * and updates it whenever the browser's storage changes. It listens for
 * changes in the '_token' and '_user' cookies. If both are present, the
 * credentials state is set with their values; otherwise, it is set to null.
 *
 * @returns {Credentials | null} The current user credentials or null if not available.
 */

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
