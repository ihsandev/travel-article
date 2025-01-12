import { apiCall } from "./axios";
import { handleError } from "./utils";

interface FetchDataOptions<TPayload, TParams> {
  method: "get" | "post" | "put" | "delete";
  endpoint: string;
  payload?: TPayload | null;
  params?: TParams;
  id?: string | number;
  type?: string;
}

/**
 * A generic function to make API calls to the Strapi API.
 *
 * @param {FetchDataOptions<TPayload, TParams>} options - The options to make the API call.
 * @returns {Promise<TPayload>} - The response from the API call.
 *
 * @example
 * fetchData({
 *   method: "get",
 *   endpoint: "articles",
 * })
 */
export const fetchData = async <TPayload, TParams>({
  method,
  endpoint,
  payload = null,
  params,
  id,
  type,
}: FetchDataOptions<TPayload, TParams>) => {
  try {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const config = params ? { params } : payload;
    const res = await apiCall[method](url, config as any);

    if (type === "infinite")
      return {
        data: res.data.data,
        page: res.data.meta.pagination.page,
        pageSize: res.data.meta.pagination.pageSize,
        pageCount: res.data.meta.pagination.pageCount,
        total: res.data.meta.pagination.total,
      };

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
