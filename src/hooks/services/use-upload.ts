import { apiCall } from "@/lib/axios";
import { handleError } from "@/lib/utils";
import { MutationOptions, useMutation } from "@tanstack/react-query";

const fetchUpload = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });
  try {
    const res = await apiCall.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export function useUpload(options?: MutationOptions<any, unknown, File[]>) {
  return useMutation({
    mutationKey: ["upload"],
    mutationFn: async (files: File[]) => {
      return await fetchUpload(files);
    },
    ...options,
  });
}
