import Image from 'next/image';
import { BRAND_LOGOS, BRAND_NAME } from '@/lib/brand';

type BrandLogoVariant = 'color' | 'light' | 'blue' | 'charcoal';
type BrandLogoLockup = 'full' | 'mark';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  lockup?: BrandLogoLockup;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

const logoSource: Record<BrandLogoLockup, Record<BrandLogoVariant, string>> = {
  full: {
    color: BRAND_LOGOS.fullColor,
    light: BRAND_LOGOS.fullLight,
    blue: BRAND_LOGOS.fullBlue,
    charcoal: BRAND_LOGOS.fullCharcoal,
  },
  mark: {
    color: BRAND_LOGOS.markColor,
    light: BRAND_LOGOS.markLight,
    blue: BRAND_LOGOS.markBlue,
    charcoal: BRAND_LOGOS.markCharcoal,
  },
};

const intrinsicSize = {
  full: { width: 976, height: 976 },
  mark: { width: 773, height: 718 },
};

export default function BrandLogo({
  variant = 'color',
  lockup = 'mark',
  className,
  priority = false,
  width,
  height,
  sizes,
}: BrandLogoProps) {
  const size = intrinsicSize[lockup];

  return (
    <Image
      src={logoSource[lockup][variant]}
      alt={BRAND_NAME}
      width={width ?? size.width}
      height={height ?? size.height}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
