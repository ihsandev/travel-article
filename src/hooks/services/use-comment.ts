import { fetchData } from "@/lib/api";
import { MutationOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type CommentPayload = {
  id?: string;
  data: {
    content: string;
    article?: number;
  };
};

const FETCH_COMMENTS_KEY = "fetch-comments";
export function useComment({
  enabledComments = false,
  mutationOptions,
}: Readonly<{
  enabledComments?: boolean;
  mutationOptions?: MutationOptions<
    CommentPayload,
    Error | AxiosError,
    unknown,
    unknown
  >;
}>) {
  const comments = useQuery({
    queryKey: [FETCH_COMMENTS_KEY],
    queryFn: () => {
      return fetchData({ method: "get", endpoint: "/comments" });
    },
    enabled: enabledComments,
  });

  const createComment = useMutation({
    mutationKey: ["create-comment"],
    mutationFn: async (comment: CommentPayload) => {
      return await fetchData({
        method: "post",
        endpoint: "/comments",
        payload: comment,
      });
    },
    ...mutationOptions,
  });

  const updateComment = useMutation({
    mutationKey: ["update-comment"],
    mutationFn: async (comment: CommentPayload) => {
      return await fetchData({
        method: "put",
        endpoint: `/comments`,
        payload: { data: comment.data },
        id: comment.id,
      });
    },
    ...mutationOptions,
  });

  const deleteComment = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: async (id: string) => {
      return await fetchData({
        method: "delete",
        endpoint: `/comments`,
        id,
      });
    },
    ...mutationOptions,
  });

  return {
    comments,
    createComment,
    deleteComment,
    updateComment,
  };
}
