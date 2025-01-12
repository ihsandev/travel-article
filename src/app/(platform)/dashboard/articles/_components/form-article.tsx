"use client";

import { InputField } from "@/components/form/input-field";
import { SelectField } from "@/components/form/select-field";
import { Upload } from "@/components/fragments/upload";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/services/use-articles";
import { useCategory } from "@/hooks/services/use-category";
import { useUpload } from "@/hooks/services/use-upload";
import { useToast } from "@/hooks/use-toast";
import { toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3, "Title is required & minimum 3 characters long"),
  description: z
    .string()
    .min(3, "Description is required & minimum 3 characters long"),
  cover_image_url: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  cover_image_url: z.string().nullable().optional(),
  category: z.string().optional(),
});

type CreateSchema = z.infer<typeof createSchema>;
type UpdateSchema = z.infer<typeof updateSchema>;

interface FormArticleProps {
  formType: "create" | "update";
  detail?: any;
}

export function FormArticle({ formType, detail }: Readonly<FormArticleProps>) {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<CreateSchema | UpdateSchema>({
    resolver: zodResolver(formType === "create" ? createSchema : updateSchema),
  });
  const router = useRouter();
  const { documentId = "" } = useParams();
  const [files, setFiles] = useState<File[] | null>(null);
  const { toast } = useToast();
  const { mutateAsync: upload, isPending: isUploading } = useUpload();
  const { mutate: createArticle, isPending: isSubmitting } = useArticles({
    mutationOptions: {
      onSuccess: () => {
        toast({
          title: "Article created successfully",
          description: "Your article has been created successfully.",
          variant: "default",
        });
        router.push("/dashboard/articles");
      },
      onError: (error) => toastError(error.message),
    },
  }).createArticle;

  const { mutate: updateArticle, isPending: isUpdating } = useArticles({
    id: documentId as string,
    mutationOptions: {
      onSuccess: () => {
        toast({
          title: "Article updated successfully",
          description: "Your article has been updated successfully.",
          variant: "default",
        });
        router.push("/dashboard/articles");
      },
      onError: (error) => toastError(error.message),
    },
  }).updateArticle;

  const { data: category } = useCategory({
    categoriesEnabled: true,
  }).categories;

  const categories =
    category?.data.map((item: any) => ({
      label: item.name,
      value: item.id?.toString(),
    })) ?? [];

  useEffect(() => {
    if (formType === "update" && detail) {
      reset({
        title: detail?.title,
        description: detail?.description,
        cover_image_url: detail?.cover_image_url,
        category: detail?.category?.id,
      });
    }
  }, [detail]);

  const handleChangeFile = (files: File[]) => {
    setFiles(files);
  };

  const onSubmit = (data: CreateSchema | UpdateSchema) => {
    const category = !data.category
      ? detail?.category?.id?.toString()
      : data.category;

    if (formType === "create") {
      upload(Array.from(files as File[])).then((res) => {
        const cover_image_url = res[0]?.url;
        toast({
          title: "File uploaded successfully",
          description: "Your file has been uploaded successfully.",
          variant: "default",
        });
        createArticle({
          data: {
            title: data.title as string,
            description: data.description as string,
            category: Number(data.category),
            cover_image_url,
          },
        });
      });
    } else if (formType === "update") {
      if (files) {
        upload(Array.from(files)).then((res) => {
          const cover_image_url = res[0]?.url;
          toast({
            title: "File uploaded successfully",
            description: "Your file has been uploaded successfully.",
            variant: "default",
          });
          updateArticle({
            data: {
              title: data.title as string,
              description: data.description as string,
              category,
              cover_image_url,
            },
          });
        });
      } else {
        updateArticle({
          data: {
            title: data.title as string,
            description: data.description as string,
            category,
            cover_image_url: data.cover_image_url as string,
          },
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3">
      <InputField
        label="Title"
        placeholder="Title"
        {...register("title")}
        className="rounded-md"
      />
      {formType === "update" && (
        <Upload
          variant="bordered"
          existingImage={watch("cover_image_url") as string}
          onChangeFile={(files) => handleChangeFile(files as File[])}
          isLoading={isUploading}
        />
      )}
      {formType === "create" && (
        <Upload
          variant="bordered"
          onChangeFile={(files) => handleChangeFile(files as File[])}
          isLoading={isUploading}
        />
      )}
      <div>
        <SelectField
          items={categories}
          placeholder="Select category"
          value={
            !watch("category")
              ? detail?.category?.id?.toString()
              : watch("category")
          }
          onValueChange={(value) => {
            setValue("category", value);
          }}
          {...register("category")}
        />
      </div>
      <InputField
        label="Description"
        formType="textarea"
        placeholder="Description"
        className="rounded-md min-h-[250px]"
        rows={20}
        {...register("description")}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting || isUploading || isUpdating}
          startContent={<Save />}
        >
          {isUploading
            ? "Uploading..."
            : isSubmitting
            ? "Saving Data..."
            : "Save"}
        </Button>
      </div>
    </form>
  );
}
