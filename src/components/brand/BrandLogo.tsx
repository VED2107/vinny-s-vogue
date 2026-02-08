import Image from 'next/image';

type Size = 'xs' | 'sm' | 'md';

type Props = {
  size: Size;
  priority?: boolean;
};

const sizeConfig: Record<Size, { w: number; h: number; sizes: string }> = {
  xs: { w: 96, h: 32, sizes: '96px' },
  sm: { w: 120, h: 40, sizes: '120px' },
  md: { w: 160, h: 54, sizes: '160px' },
};

export const BrandLogo = ({ size, priority = false }: Props) => {
  const cfg = sizeConfig[size];

  return (
    <Image
      src="/images/brand/IMG_0266.PNG"
      alt="Vinny’s Vogue"
      width={cfg.w}
      height={cfg.h}
      priority={priority}
      className="h-auto w-auto"
      sizes={cfg.sizes}
    />
  );
};
