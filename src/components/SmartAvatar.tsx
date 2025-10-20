"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";

interface SmartAvatarProps {
  src?: string | null;
  alt: string;
  sx?: object;
}

const FALLBACK_AVATAR = "/default-avatar.png";

export default function SmartAvatar({ src, alt, sx, ...rest }: SmartAvatarProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_AVATAR);

  useEffect(() => {
    setCurrentSrc(src || FALLBACK_AVATAR);
    setIsLoaded(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (currentSrc !== FALLBACK_AVATAR) {
      setCurrentSrc(FALLBACK_AVATAR);
    }
  };

  return (
    <Avatar
      {...rest}
      alt={alt}
      src={currentSrc}
      sx={{
        ...sx,

        backgroundColor: "rgba(0,0,0,0.5)",

        "& .MuiAvatar-img": {
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        },
      }}
      imgProps={{
        onLoad: handleLoad,
        onError: handleError,
      }}
    />
  );
}
