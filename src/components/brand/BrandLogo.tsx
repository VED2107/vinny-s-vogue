import Image from 'next/image';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'full' | 'icon';

type Props = {
  size: Size;
  variant: Variant;
  showTagline?: boolean;
};

const sizeConfig: Record<Size, { full: { w: number; h: number }; icon: { w: number; h: number }; cropH: number }> = {
  sm: { full: { w: 180, h: 64 }, icon: { w: 44, h: 44 }, cropH: 44 },
  md: { full: { w: 240, h: 86 }, icon: { w: 56, h: 56 }, cropH: 60 },
  lg: { full: { w: 340, h: 122 }, icon: { w: 72, h: 72 }, cropH: 84 },
};

export const BrandLogo = ({ size, variant, showTagline = false }: Props) => {
  const cfg = sizeConfig[size];

  const priority = size === 'sm' && variant === 'full' && showTagline === false;

  const src = variant === 'icon' ? '/images/brand/dresslogo.png' : '/images/brand/logo.PNG';

  if (variant === 'icon') {
    return (
      <Image
        src={src}
        alt="Vinny’s Vogue"
        width={cfg.icon.w}
        height={cfg.icon.h}
        priority={priority}
        className="h-auto w-auto"
        sizes={size === 'sm' ? '44px' : size === 'md' ? '56px' : '72px'}
      />
    );
  }

  if (showTagline) {
    return (
      <Image
        src={src}
        alt="Vinny’s Vogue"
        width={cfg.full.w}
        height={cfg.full.h}
        priority={priority}
        className="h-auto w-auto"
        sizes={size === 'sm' ? '160px' : size === 'md' ? '220px' : '320px'}
      />
    );
  }

  return (
    <div className="overflow-hidden" style={{ height: cfg.cropH }} aria-label="Vinny’s Vogue">
      <Image
        src={src}
        alt="Vinny’s Vogue"
        width={cfg.full.w}
        height={cfg.full.h}
        priority={priority}
        className="h-auto w-auto object-cover object-top"
        sizes={size === 'sm' ? '140px' : size === 'md' ? '200px' : '300px'}
      />
    </div>
  );
};
