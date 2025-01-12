import Image, { ImageProps } from "next/image";
import { useState } from "react";

const isImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url); // Validates URL format
    const validProtocols = ["http:", "https:"];
    const isProtocolValid = validProtocols.includes(parsedUrl.protocol);

    const isImageExtension = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(
      parsedUrl.pathname
    );

    return isProtocolValid && isImageExtension;
  } catch {
    return false; // Return false if URL is invalid
  }
};

interface NextImageCustomProps extends ImageProps {
  fallbackSrc?: string;
}

export const NextImage = ({
  fallbackSrc = "/no-image.png",
  ...imageProps
}: NextImageCustomProps) => {
  const [imageSrc, setImageSrc] = useState<string>(imageProps.src as string);

  return (
    <Image
      {...imageProps}
      src={isImageUrl(imageSrc) ? imageSrc : fallbackSrc ?? ""}
      alt="Image"
      onError={() => setImageSrc(fallbackSrc)}
    />
  );
};
