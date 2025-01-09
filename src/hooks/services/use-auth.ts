import { apiCall } from "@/lib/axios";
import { handleError } from "@/lib/utils";
import { MutateOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

const fetchAuth = async ({
  endpoint = "",
  data,
}: {
  data: RegisterPayload | LoginPayload;
  endpoint?: "register" | "";
}) => {
  try {
    const res = await apiCall.post(`/auth/local/${endpoint}`, data);
    const { jwt, user } = res.data;
    if (res.status === 200 && endpoint === "") {
      Cookies.set("_token", jwt);
      Cookies.set("_user", JSON.stringify(user));
    }
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export function useAuth(
  options?: MutateOptions<
    RegisterPayload | LoginPayload,
    Error | AxiosError,
    unknown,
    unknown
  >
) {
  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterPayload) =>
      fetchAuth({ data, endpoint: "register" }),
    ...options,
  });

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginPayload) => fetchAuth({ data }),
    ...options,
  });

  return { register, login };
}
