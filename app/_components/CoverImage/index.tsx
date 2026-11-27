import Image from "next/image";
import type { FC } from "react";

type CoverImageProps = {
  src: string;
  alt: string;
};

const CoverImage: FC<CoverImageProps> = ({ src, alt }) => (
  <div className="mb-6 max-h-50 overflow-hidden rounded-lg sm:max-h-80">
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      className="h-full w-full object-cover object-center"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 960px"
      priority
    />
  </div>
);

export default CoverImage;
