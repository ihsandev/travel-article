"use client";

import { InputField } from "@/components/form/input-field";
import { CustomAlertDialog } from "@/components/fragments/custom-alert-dialog";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/services/use-category";
import { useCredentials } from "@/hooks/use-credentials";
import { useToast } from "@/hooks/use-toast";
import { toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Edit2, Loader, Plus, X, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Category Name is required"),
  description: z.string().nullable().optional(),
});

type CategorySchema = z.infer<typeof categorySchema>;

export default function Categories() {
  const credentials = useCredentials();
  const router = useRouter();
  const { toast } = useToast();
  const [documentId, setDocumentId] = React.useState<string | null>(null);
  const [dialogMode, setDialogMode] = React.useState<
    "delete" | "add" | "edit" | ""
  >("");

  const isEditMode = dialogMode === "edit";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  const { data: category, isLoading } = useCategory({
    categoriesEnabled: true,
  }).categories;

  const categories = category?.data ?? [];

  const handleCancel = () => {
    setDocumentId(null);
    setDialogMode("");
    reset();
  };

  const { mutate: createCategory, isPending: isCreating } = useCategory({
    mutationOptions: {
      onSuccess: () => {
        toast({
          title: "Category Created",
          description: "Category created successfully",
        });
        handleCancel();
      },
      onError: (error) => toastError(error.message),
    },
  }).createCategory;

  const { mutate: updateCategory, isPending: isUpdating } = useCategory({
    categoryId: documentId as string,
    mutationOptions: {
      onSuccess: () => {
        toast({
          title: "Category Updated",
          description: "Category updated successfully",
        });
        handleCancel();
      },
      onError: (error) => toastError(error.message),
    },
  }).updateCategory;

  const { mutate: deleteCategory, isPending: isDeleting } = useCategory({
    categoryId: documentId as string,
    mutationOptions: {
      onSuccess: () => {
        toast({
          title: "Category Deleted",
          description: "Category deleted successfully",
        });
        handleCancel();
      },
      onError: (error) => toastError(error.message),
    },
  }).deleteCategory;

  const handleCreate: SubmitHandler<CategorySchema> = (
    data: CategorySchema
  ) => {
    createCategory({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  };

  const handleUpdate: SubmitHandler<CategorySchema> = (
    data: CategorySchema
  ) => {
    updateCategory({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  };

  const handleDelete = () => {
    deleteCategory(documentId);
  };

  const handleConfirm = (docId: string) => {
    setDocumentId(docId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline space-x-1">
          <h1 className="text-2xl font-semibold text-sky-900">Categories</h1>
          <span className="text-xs text-slate-500">
            ({category?.meta.pagination.total ?? 0}) found
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setDialogMode("add");
            }}
            startContent={<Plus className="h-4 w-4" />}
            size="sm"
          >
            Add Category
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-28">
          <Loader className="animate-spin" size={30} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-md bg-sky-900 text-sky-50 p-2 pt-4 pb-2 relative"
            >
              <h3 className="text-sky-300">{category.name}</h3>
              {category.description ? (
                <p className="text-xs text-sky-100">{category.description}</p>
              ) : (
                <p className="text-xs text-sky-300/50">No Description</p>
              )}
              <div className="absolute top-1 right-1 flex items-center gap-2">
                <Edit
                  size={14}
                  className="cursor-pointer text-sky-200 hover:text-sky-200/70"
                  onClick={() => {
                    setValue("name", category.name);
                    setValue("description", category.description);
                    setDocumentId(category.documentId);
                    setDialogMode("edit");
                  }}
                />
                <XCircle
                  size={14}
                  onClick={() => {
                    handleConfirm(category.documentId);
                    setDialogMode("delete");
                  }}
                  className="cursor-pointer text-rose-500 hover:text-rose-500/70"
                />
              </div>
            </div>
          ))}
          <CustomAlertDialog
            title="Delete Category"
            isOpen={!!documentId && dialogMode === "delete"}
            description="Are you sure you want to delete this category?"
            onCancel={handleCancel}
            onConfirm={handleDelete}
            isLoading={isDeleting}
          />
          <CustomAlertDialog
            title={isEditMode ? "Edit Category" : "Add New Category"}
            isOpen={dialogMode === "add" || dialogMode === "edit"}
            formContent={
              <form
                onSubmit={handleSubmit(
                  isEditMode ? handleUpdate : handleCreate
                )}
                className="space-y-2"
              >
                <InputField
                  label="Category Name"
                  placeholder="Name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <InputField
                  label="Description"
                  formType="textarea"
                  placeholder="Description"
                  error={errors.description?.message}
                  {...register("description")}
                />
                <div className="flex justify-end space-x-2 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    startContent={<X />}
                    onClick={handleCancel}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    startContent={<Plus />}
                    isLoading={isCreating || isUpdating}
                  >
                    {isEditMode ? "Update" : "Add New"}
                  </Button>
                </div>
              </form>
            }
          />
        </div>
      )}
    </div>
  );
}
