import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleError(error: any) {
  if (error instanceof AxiosError) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error?.message);
    } else throw new Error(error?.response?.data?.message || error.message);
  }

  throw new Error("Unknown Error");
}
