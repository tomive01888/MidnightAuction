"use client";

import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  onImageReady?: () => void;
};

export function FallbackImg({ fallbackSrc = "/placeholder.png", onImageReady, onError, src, ...rest }: Props) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imageElement = e.currentTarget;

    if (imageElement.src !== fallbackSrc) {
      imageElement.src = fallbackSrc;
      imageElement.alt = "Fallback image";
    }

    if (onError) {
      onError(e);
    }
  };

  return <img {...rest} src={src || fallbackSrc} onLoad={onImageReady} onError={handleError} loading="lazy" />;
}
