"use client";

import { CustomAlertDialog } from "@/components/fragments/custom-alert-dialog";
import { DataTable } from "@/components/fragments/data-table";
import { NextImage } from "@/components/next-image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArticleQueryParams, useArticles } from "@/hooks/services/use-articles";
import { useCategory } from "@/hooks/services/use-category";
import { useCredentials } from "@/hooks/use-credentials";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Ellipsis, Eye, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Articles() {
  const router = useRouter();
  const { toast } = useToast();
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const credentials = useCredentials();
  const [params, setParams] = useState<ArticleQueryParams>({
    "pagination[page]": 1,
    "pagination[pageSize]": 10,
    populate: "*",
    "filters[title][$eqi]": "",
    "filters[category][name][$eqi]": "",
  });

  const debounce = useDebounce(params["filters[title][$eqi]"] as string, 300);

  const newParams = Object.entries(params).reduce(
    (acc: { [key: string]: any }, [key, value]) => {
      if (key === "filters[title][$eqi]" && value) {
        acc[key] = debounce;
      } else if (value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as ArticleQueryParams
  );

  const {
    data: articles,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useArticles({
    params: newParams,
    articlesEnabled: true,
  }).getArticles;

  const { mutate: deleteArticle, isPending } = useArticles({
    id: documentId as string,
    mutationOptions: {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        });
        setDocumentId(null);
      },
    },
  }).deleteArticle;

  const totalData = articles?.pages?.[0]?.total ?? 0;

  const { data: category } = useCategory({
    categoriesEnabled: true,
  }).categories;

  const categories =
    category?.data?.map((item: any, index: number) => ({
      value: `${index}-${item.name}`,
      label: item.name,
    })) ?? [];

  const handleDelete = () => {
    deleteArticle(documentId as string);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline space-x-1">
          <h1 className="text-2xl font-semibold text-sky-900">Articles</h1>
          <span className="text-xs text-slate-500">({totalData}) found</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => router.push("/dashboard/articles/add")}
            startContent={<Plus className="h-4 w-4" />}
            size="sm"
          >
            Add Article
          </Button>
        </div>
      </div>
      <div>
        <DataTable
          columns={[
            {
              accessorKey: "title",
              header: "Title",
              cell: (info) => (
                <h3 className="font-medium capitalize">
                  {info.getValue() as string}
                </h3>
              ),
              size: 230,
            },
            {
              accessorKey: "cover_image_url",
              header: "Thumbnail",
              cell: (info) =>
                info.getValue() ? (
                  <NextImage
                    src={(info.getValue() as string) ?? ""}
                    alt={info.row.original.title}
                    width={80}
                    height={80}
                    className="object-cover w-[80px] h-full rounded-lg"
                  />
                ) : null,
              size: 150,
            },
            {
              accessorKey: "category",
              header: "Category",
              cell: (info: any) => info.getValue()?.name,
              size: 100,
            },

            {
              accessorKey: "publishedAt",
              header: "Published At",
              cell: (info) => {
                return formatDate(info.getValue() as string);
              },
              size: 100,
            },
            {
              accessorKey: "user",
              header: "Author",
              cell: (info: any) => (
                <div className="flex flex-col">
                  <span className="capitalize">
                    {info.getValue()?.username}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {info.getValue()?.email}
                  </span>
                </div>
              ),
              size: 200,
            },
            {
              accessorKey: "documentId",
              header: "",
              cell: (info: any) => {
                return (
                  <div className="flex justify-end w-full items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/dashboard/articles/${info.getValue()}`
                            )
                          }
                        >
                          <Eye className="h-5 w-5" /> View
                        </DropdownMenuItem>
                        {credentials?.user?.email ===
                          info.row.original.user?.email && (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setDocumentId(info.getValue() as string);
                            }}
                          >
                            <Trash className="h-5 w-5 text-rose-500" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              },
            },
          ]}
          isShowFilter
          filterOption={{
            search: params["filters[title][$eqi]"] as string,
            setSearch: (value) => {
              setParams((prev) => ({
                ...prev,
                "pagination[page]": 1,
                "filters[title][$eqi]": value,
              }));
            },
            category: selectedCategory,
            categories: categories,
            setCategory: (originalValue, filterValue) => {
              setSelectedCategory(originalValue);
              setParams((prev) => ({
                ...prev,
                "pagination[page]": 1,
                "filters[category][name][$eqi]": filterValue,
              }));
            },
          }}
          data={articles}
          isLoading={isLoading}
          paginationType="infinite-scroll"
          infiniteOptions={{ hasNextPage, fetchNextPage, isFetchingNextPage }}
        />
      </div>
      <CustomAlertDialog
        title="Delete Article"
        isOpen={!!documentId}
        description="Are you sure you want to delete this article?"
        onCancel={() => setDocumentId(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
      />
    </div>
  );
}
