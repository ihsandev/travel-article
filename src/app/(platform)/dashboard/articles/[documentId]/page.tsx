"use client";

import { BreadcrumbWrapper } from "@/components/fragments/breadcrumb-wrapper";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useArticles } from "@/hooks/services/use-articles";
import { Edit, Reply, Trash2, UserCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormArticle } from "../_components/form-article";
import { ViewArticle } from "../_components/view-article";
import { useCredentials } from "@/hooks/use-credentials";
import { cn } from "@/lib/utils";
import { useComment } from "@/hooks/services/use-comment";
import { Comments } from "../_components/comments";

export default function ArticleDetail() {
  const { documentId } = useParams();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const credential = useCredentials();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: article, refetch } = useArticles({
    id: documentId as string,
    params: {
      populate: "*",
    },
    detailArticleEnabled: !!documentId,
  }).getArticleById;

  const detail = article?.data ?? {};
  const isAllowToMakeChange = credential?.user?.email === detail?.user?.email;

  return (
    <div>
      <div className="flex justify-between items-start mb-5">
        <div>
          <BreadcrumbWrapper>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/articles">Articles</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {detail?.title ?? "Detail Article"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbWrapper>
        </div>
        {mounted && isAllowToMakeChange && (
          <Button
            size="sm"
            startContent={<Edit />}
            onClick={() => {
              if (mode === "view") setMode("edit");
              else setMode("view");
            }}
          >
            {mode === "view" ? "Edit" : "Cancel"}
          </Button>
        )}
      </div>
      {mode === "edit" ? (
        <FormArticle formType="update" detail={detail} />
      ) : (
        <ViewArticle detail={detail} />
      )}
      <Comments detail={detail} refetchDetail={refetch} />
    </div>
  );
}
