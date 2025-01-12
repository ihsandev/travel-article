"use client";

import { Edit, LoaderCircle, UploadIcon } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/services/use-upload";
import { useState } from "react";
import Image from "next/image";

interface UploadProps extends React.HTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  variant?: "primary" | "outline" | "bordered";
  existingImage?: string;
  onChangeFile?: (files: File[] | null) => void;
  isMultiple?: boolean;
  isLoading?: boolean;
  acceptFile?: string[];
}

export function Upload({
  icon,
  label,
  variant = "primary",
  existingImage,
  isMultiple,
  isLoading,
  acceptFile = [],
  onChangeFile,
  ...props
}: Readonly<UploadProps>) {
  const acceptedFiles = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/avif",
    "image/bmp",
    ...acceptFile,
  ].join(",");

  const { toast } = useToast();
  const [showEditImage, setShowEditImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      if (acceptedFiles.includes(file.type) === false) {
        e.target.value = "";
        setPreviewImage("");
        onChangeFile?.(null);
        toast({
          title: "Invalid file type",
          description: "Please select a valid file type.",
          variant: "destructive",
        });
        return;
      }
      onChangeFile?.(Array.from(files));
      setPreviewImage(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const renderUploadButton: any = (isEdit?: boolean) => {
    const newVariant = isEdit ? "primary" : variant;
    return (
      <div>
        <Label
          htmlFor="thumbnail"
          className={cn(
            "cursor-pointer rounded-full py-2 px-8 flex items-center space-x-2 text-center justify-center",
            newVariant === "primary" &&
              "bg-sky-800 hover:bg-sky-800/90 text-sky-50",
            newVariant === "outline" &&
              "border border-sky-800 bg-transparent text-sky-800",
            newVariant === "bordered" &&
              "border border-sky-800 border-dashed bg-transparent text-sky-800 py-4 rounded-md"
          )}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              {icon ?? <UploadIcon />}
              <span>{label ?? isEdit ? "Change File" : "Upload"}</span>
            </>
          )}
        </Label>
        <input
          type="file"
          className="hidden"
          id="thumbnail"
          accept={acceptedFiles}
          multiple={isMultiple}
          onChange={handleOnChange}
          {...props}
        />
      </div>
    );
  };

  const imageConfig = {
    alt: "Preview Image",
    width: 800,
    height: 800,
    className: "rounded-md object-contain",
  };

  if (previewImage || existingImage) {
    return (
      <div
        onMouseEnter={() => setShowEditImage(true)}
        onMouseLeave={() => setShowEditImage(false)}
        className="h-full w-[350px] relative rounded-md overflow-hidden"
      >
        {previewImage ? (
          <Image src={previewImage ?? ""} {...imageConfig} />
        ) : (
          <Image src={existingImage ?? ""} {...imageConfig} />
        )}
        {showEditImage && (
          <div className="absolute top-0 left-0 w-[350px] rounded-md h-full flex items-center justify-center bg-black/50">
            {renderUploadButton(true)}
          </div>
        )}
      </div>
    );
  }

  return renderUploadButton();
}
