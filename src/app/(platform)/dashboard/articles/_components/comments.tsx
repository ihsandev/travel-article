"use client";

import { InputField } from "@/components/form/input-field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useComment } from "@/hooks/services/use-comment";
import { useCredentials } from "@/hooks/use-credentials";
import { cn, toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Reply, Trash2, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().nullable().optional(),
  update_content: z.string().nullable().optional(),
});

type CommentSchema = z.infer<typeof commentSchema>;

export function Comments({
  detail,
  refetchDetail,
}: Readonly<{
  detail: any;
  refetchDetail?: () => void;
}>) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
  });

  const credential = useCredentials();
  const [docId, setDocId] = useState<string>("");

  const { mutate: addComment, isPending } = useComment({
    mutationOptions: {
      onSuccess: () => {
        reset();
        refetchDetail?.();
      },
      onError: (error) => {
        toastError(error.message);
      },
    },
  }).createComment;

  const { mutate: updateComment, isPending: isUpdating } = useComment({
    mutationOptions: {
      onSuccess: () => {
        reset();
        setDocId("");
        refetchDetail?.();
      },
      onError: (error) => {
        toastError(error.message);
      },
    },
  }).updateComment;

  const { mutate: deleteComment, isPending: isDeleting } = useComment({
    mutationOptions: {
      onSuccess: () => {
        refetchDetail?.();
      },
      onError: (error) => {
        toastError(error.message);
      },
    },
  }).deleteComment;

  const onSubmitComment: SubmitHandler<CommentSchema> = (
    data: CommentSchema
  ) => {
    if (docId) {
      updateComment({
        data: { content: data.update_content as string },
        id: docId,
      });
    } else {
      addComment({
        data: { content: data.content as string, article: detail.id },
      });
    }
  };

  const onDeleteComment = (id: string) => {
    deleteComment(id);
  };

  const renderFormComment = (isUpdateComment?: boolean) => {
    return (
      <form onSubmit={handleSubmit(onSubmitComment)}>
        <div className="relative">
          <InputField
            placeholder="Comment here"
            rows={4}
            formType="textarea"
            disabled={isPending}
            className={cn(
              "rounded-md h-22",
              docId && isUpdateComment && "mx-3"
            )}
            error={
              docId && isUpdateComment
                ? errors.update_content?.message
                : errors.content?.message
            }
            {...(docId && isUpdateComment
              ? register("update_content")
              : register("content"))}
          />
          <div
            className={cn(
              "absolute bottom-2 right-2 flex items-center gap-x-2",
              docId && isUpdateComment
                ? errors.update_content?.message
                : errors.content?.message && "bottom-6",
              docId && isUpdateComment && "bottom-3 right-4"
            )}
          >
            {docId && isUpdateComment && (
              <Button
                onClick={() => {
                  setDocId("");
                  setValue("update_content", "");
                }}
                size="sm"
                isLoading={isUpdating}
                startContent={<X />}
                variant="ghost"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              isLoading={isPending || isUpdating}
              disabled={
                docId && isUpdateComment
                  ? watch("update_content") === ""
                  : watch("content") === ""
              }
              startContent={<Reply />}
            >
              Comment
            </Button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <>
      <Separator className="my-5 h-1" />
      <div className="mt-5 text-sky-950">
        {renderFormComment()}
        <h3 className="font-semibold text-xl my-4">
          ({detail?.comments?.length ?? 0}) Comments
        </h3>
        <div className="border border-border overflow-hidden rounded-md">
          {detail?.comments
            ?.map((comment: any) =>
              docId === comment.documentId ? (
                <div key={comment.id}>{renderFormComment(true)}</div>
              ) : (
                <div
                  key={comment.id}
                  className={cn(
                    "bg-slate-50 border-b px-3 py-4 min-h-16 relative flex gap-x-2 group",
                    isDeleting && "bg-opacity-50"
                  )}
                >
                  <UserCircle className="text-slate-300" size={24} />
                  <p className="flex-1">{comment?.content}</p>
                  <div className="absolute bottom-1 right-1 flex items-center space-x-1">
                    <Button
                      className={cn("hidden group-hover:flex")}
                      disabled={isDeleting}
                      onClick={() => {
                        setDocId(comment.documentId);
                        setValue("update_content", comment.content);
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <Edit size={16} className="text-sky-500" />
                    </Button>
                    <Button
                      className={cn("hidden group-hover:flex")}
                      disabled={isDeleting}
                      onClick={() => onDeleteComment(comment.documentId)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 size={16} className="text-rose-500" />
                    </Button>
                  </div>
                </div>
              )
            )
            ?.reverse()}
        </div>
      </div>
    </>
  );
}
