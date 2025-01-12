import { fetchData } from "@/lib/api";
import {
  MutationOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

type CommentPayload = {
  id?: string;
  data: {
    content: string;
    article?: number;
  };
};

export type CommentQueryParams = {
  "pagination[page]"?: number;
  "pagination[pageSize]"?: number;
  "populate[article]"?: string;
  "sort[0]"?: string;
  "populate[user]?": string;
};

const FETCH_COMMENTS_KEY = "fetch-comments";
export function useComment({
  params,
  enabledComments = false,
  mutationOptions,
}: Readonly<{
  params?: CommentQueryParams;
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

  const infiniteComments = useInfiniteQuery({
    queryKey: [FETCH_COMMENTS_KEY, params],
    queryFn: ({ pageParam }) => {
      return fetchData({
        endpoint: "/comments",
        method: "get",
        params: {
          ...params,
          "pagination[page]": pageParam ?? 1,
        },
        type: "infinite",
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalFetched = lastPage.page * lastPage.pageSize;
      const hasMore = totalFetched < lastPage.total;
      return hasMore ? lastPage.page + 1 : undefined;
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
    infiniteComments,
    createComment,
    deleteComment,
    updateComment,
  };
}
