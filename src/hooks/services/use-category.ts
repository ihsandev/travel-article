import { fetchData } from "@/lib/api";
import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const FETCH_CATEGORY_KEY = "fetch-category";

type CategoryResponse = {
  data: {
    id: number;
    documentId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: null;
  }[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
};

type CategoryPayload = {
  data: {
    name: string;
    description?: string | null;
  };
};

export function useCategory({
  categoryId,
  categoriesEnabled = false,
  detailCategoryEnabled = false,
  mutationOptions,
}: Readonly<{
  categoryId?: number | string;
  categoriesEnabled?: boolean;
  detailCategoryEnabled?: boolean;
  mutationOptions?: MutationOptions<
    CategoryPayload,
    Error | AxiosError,
    any,
    any
  >;
}>) {
  const queryClient = useQueryClient();

  const revalidateCategories = () => {
    queryClient.invalidateQueries({
      queryKey: [FETCH_CATEGORY_KEY],
    });
  };

  const endpoint = "/categories";

  const categories = useQuery({
    queryKey: [FETCH_CATEGORY_KEY],
    queryFn: () => {
      return fetchData({
        endpoint,
        method: "get",
      }) as Promise<CategoryResponse>;
    },
    enabled: categoriesEnabled,
  });

  const detailCategory = useQuery({
    queryKey: ["detail-category"],
    queryFn: () => {
      return fetchData({ endpoint, method: "get", id: categoryId });
    },
    enabled: detailCategoryEnabled,
  });

  const createCategory = useMutation({
    mutationKey: ["create-category"],
    mutationFn: (payload: CategoryPayload) => {
      return fetchData({ endpoint, method: "post", payload });
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions?.onSuccess?.(data, variables, context);
      revalidateCategories();
    },
  });

  const updateCategory = useMutation({
    mutationKey: ["update-category"],
    mutationFn: (payload: CategoryPayload) => {
      return fetchData({ endpoint, method: "put", payload, id: categoryId });
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions?.onSuccess?.(data, variables, context);
      revalidateCategories();
    },
  });

  const deleteCategory = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: (id) => {
      return fetchData({ endpoint, method: "delete", id });
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions?.onSuccess?.(data, variables, context);
      revalidateCategories();
    },
  });

  return {
    categories,
    detailCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
