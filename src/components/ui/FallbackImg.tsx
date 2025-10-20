"use client";

import React, { useState, useEffect } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  onImageReady?: () => void;
};

export function FallbackImg({ fallbackSrc = "/placeholder.png", onImageReady, src, ...rest }: Props) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    onImageReady?.();
  };

  return (
    <img
      {...rest}
      src={imgSrc}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
}
