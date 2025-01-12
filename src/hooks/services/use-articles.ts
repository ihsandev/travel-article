import { fetchData } from "@/lib/api";
import {
  MutationOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const FETCH_ARTICLES_KEY = "'fetch-articles'";

export type ArticleQueryParams = {
  "pagination[page]"?: number;
  "pagination[pageSize]"?: number;
  "populate[comments][populate][user]"?: string;
  "populate[user]"?: string;
  "populate[category]"?: string;
  populate?: string;
  "filters[title][$eqi]"?: string;
  "filters[category][name][$eqi]"?: string;
};

type ArticlePayload = {
  data: {
    title: string;
    description: string;
    cover_image_url: string;
    category: number;
  };
};

export function useArticles({
  id,
  params,
  allArticlesEnabled = false,
  articlesEnabled = false,
  detailArticleEnabled = false,
  mutationOptions,
}: {
  id?: string;
  params?: ArticleQueryParams;
  allArticlesEnabled?: boolean;
  articlesEnabled?: boolean;
  detailArticleEnabled?: boolean;
  mutationOptions?: MutationOptions<
    ArticlePayload,
    Error | AxiosError,
    any,
    any
  >;
}) {
  const queryClient = useQueryClient();

  const revalidateArticles = () => {
    queryClient.invalidateQueries({
      queryKey: [FETCH_ARTICLES_KEY],
    });
  };

  const endpoint = "/articles";

  const getAllArticles = useQuery({
    queryKey: ["fetch-all-articles"],
    queryFn: () => {
      return fetchData({ endpoint, method: "get", params });
    },
    enabled: allArticlesEnabled,
  });

  const getArticles = useInfiniteQuery({
    queryKey: [FETCH_ARTICLES_KEY, params],
    queryFn: ({ pageParam }) => {
      return fetchData({
        endpoint,
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
    enabled: articlesEnabled,
  });

  const getArticleById = useQuery({
    queryKey: ["fetch-article-by-id", id],
    queryFn: () => {
      return fetchData({ endpoint, method: "get", id, params });
    },
    enabled: detailArticleEnabled,
  });

  const createArticle = useMutation({
    mutationKey: ["create-article"],
    mutationFn: (payload: ArticlePayload) => {
      return fetchData({ endpoint, method: "post", payload });
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions?.onSuccess?.(data, variables, context);
      revalidateArticles();
    },
  });

  const updateArticle = useMutation({
    mutationKey: ["update-article"],
    mutationFn: (payload: ArticlePayload) => {
      return fetchData({ endpoint, method: "put", id, payload });
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions?.onSuccess?.(data, variables, context);
      revalidateArticles();
    },
  });

  const deleteArticle = useMutation({
    mutationKey: ["delete-article"],
    mutationFn: (id: string) => {
      return fetchData({ endpoint, method: "delete", id });
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions?.onSuccess?.(data, variables, context);
      revalidateArticles();
    },
  });

  return {
    getAllArticles,
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
  };
}
