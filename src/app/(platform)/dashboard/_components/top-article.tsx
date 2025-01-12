import { NextImage } from "@/components/next-image";

export function TopArticle({ items }: Readonly<{ items: any }>) {
  return (
    <div className="space-y-8">
      {items?.map((article: any) => (
        <div className="flex items-center" key={article?.id}>
          <NextImage
            src={article?.cover_image_url}
            width={40}
            height={40}
            className="rounded-sm object-cover h-10 w-10"
            alt={article?.title}
          />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{article?.title}</p>
            <p className="text-sm text-muted-foreground">
              {article?.user?.email}
            </p>
          </div>
          <div className="ml-auto flex flex-col items-center self-end">
            <p className="font-medium">{article?.commentCount}</p>
            <p className="text-[10px] text-muted-foreground">Comments</p>
          </div>
        </div>
      ))}
    </div>
  );
}
