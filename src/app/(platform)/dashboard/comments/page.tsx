"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentQueryParams, useComment } from "@/hooks/services/use-comment";
import { Loader, MessageCircle, User, UserCircle } from "lucide-react";
import { useState } from "react";

export default function Comments() {
  const [params, setParams] = useState<CommentQueryParams>({
    "pagination[page]": 1,
    "pagination[pageSize]": 10,
    "populate[user]?": "*",
    "populate[article]": "*",
    "sort[0]": "",
  });

  const newParams = Object.entries(params).reduce(
    (acc: { [key: string]: any }, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as CommentQueryParams
  );

  const {
    data: comments,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useComment({
    enabledComments: true,
    params: newParams as CommentQueryParams,
  }).infiniteComments;

  console.log(comments);
  return (
    <section className="grid gap-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader className="animate-spin" />
        </div>
      ) : (
        comments?.pages.map((page, index) => {
          return (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page?.data?.map((comment: any) => {
                return (
                  <Card
                    onClick={() => console.log(comment)}
                    key={comment.id}
                    className="border border-sky-900 shadow-md shadow-sky-200 overflow-hidden relative"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                      <CardTitle className="text-base font-medium text-sky-900 flex items-center gap-2">
                        <UserCircle />
                        {comment?.user?.username}
                      </CardTitle>
                      <MessageCircle size={20} className="text-sky-900/70" />
                    </CardHeader>
                    <CardContent className="ml-8">
                      <p className="text-sm text-sky-800">{comment?.content}</p>
                      <MessageCircle
                        size={120}
                        className="text-sky-900/10 absolute -right-3 -bottom-6"
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })
      )}
      <div className="flex items-center justify-center">
        {isFetchingNextPage && <Loader className="animate-spin mt-3" />}
        {hasNextPage && !isFetchingNextPage && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => fetchNextPage()}>
              Show More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
