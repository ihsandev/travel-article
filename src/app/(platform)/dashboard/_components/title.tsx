import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function Title({
  text,
  isShowBackButton,
}: Readonly<{
  text: string;
  isShowBackButton?: boolean;
}>) {
  const router = useRouter();
  return (
    <div className="flex items-baseline space-x-2 mb-5">
      {isShowBackButton && (
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => router.back()}
        />
      )}
      <h1 className="text-2xl font-bold text-sky-900">{text}</h1>
    </div>
  );
}
