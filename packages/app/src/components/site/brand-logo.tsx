import Image from "next/image";
import { brand } from "../../brand";

/** Appens logga och namn i två färger (navbar och footer). */
export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <>
      {brand.logo && (
        <Image
          src={brand.logo}
          alt={brand.namn}
          width={100}
          height={100}
          className="h-16 w-16 object-contain"
          priority={priority}
        />
      )}
      <span>
        <span className="text-red-600">{brand.namnDelar[0]}</span>
        <span className="text-blue-600">{brand.namnDelar[1]}</span>
      </span>
    </>
  );
}
