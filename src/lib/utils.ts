import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that merges multiple class names together.
 *
 * This function takes one or more class names as strings or arrays of strings
 * and returns a single string that can be used as a className.
 *
 * This function is a wrapper around tailwind-merge's `twMerge` function and
 * clsx's `clsx` function. It is used to merge multiple class names together
 * into a single string that can be used as a className.
 *
 * @param inputs One or more class names as strings or arrays of strings.
 * @returns A single string that can be used as a className.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Handles an error by throwing an error with a more useful message.
 *
 * If the error is an AxiosError and the response contains an error property,
 * it will throw the error message from the error property.
 *
 * If the AxiosError response does not contain an error property, it will
 * throw the response message if it exists, otherwise it will throw the
 * original error message.
 *
 * If the error is not an AxiosError, it will throw a generic "Unknown Error"
 * message.
 */
export function handleError(error: any) {
  if (error instanceof AxiosError) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error?.message);
    } else throw new Error(error?.response?.data?.message || error.message);
  }

  throw new Error("Unknown Error");
}

/**
 * Formats a date string into a human-readable format.
 *
 * This function takes a date string and returns a formatted string in the
 * "day month year" format, such as "1 January 2023".
 *
 * @param date - A string representing a date.
 * @returns A formatted date string in "day month year" format.
 */

export function formatDate(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

/**
 * Displays an error toast notification with a given message.
 *
 * This function shows a toast notification with a title of "Error"
 * and a description containing the provided message. If no message
 * is provided, it defaults to "Something went wrong".
 *
 * @param message - The error message to display in the toast notification.
 */

export function toastError(message: string) {
  toast({
    title: "Error",
    description: message ?? "Something went wrong",
    variant: "destructive",
  });
}
