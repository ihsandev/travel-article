"use client";

import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Title } from "../../_components/title";

type DetailArticleType = {
  title?: string;
  description?: string;
  cover_image_url?: string;
  publishedAt?: string;
};

interface ViewArticleProps {
  detail: DetailArticleType;
}

export function ViewArticle({ detail }: Readonly<ViewArticleProps>) {
  return (
    <div>
      <div className="flex flex-col mb-4">
        <Title text={detail?.title ?? ""} isShowBackButton />
        <span className="text-xs ml-6 text-slate-500">
          Published At: {formatDate(detail?.publishedAt as string)}
        </span>
      </div>
      {detail?.cover_image_url && (
        <div className={`w-[400px] h-full relative mb-4`}>
          <Image
            src={detail?.cover_image_url ?? ""}
            alt="Cover Image"
            width={800}
            height={800}
            className="object-contain rounded-md"
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: detail?.description ?? "" }} />
    </div>
  );
}
