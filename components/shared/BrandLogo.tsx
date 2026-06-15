import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import brandLogo from '@/public/images/esb-logo.png';

type BrandLogoProps = {
  href?: string | null;
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  href = '/',
  className,
  frameClassName,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  const content = (
    <span className={cn('brand-logo__frame', frameClassName)}>
      <Image
        src={brandLogo}
        alt="ESB PowerLine — Energy Solution of Bangladesh"
        className={cn('brand-logo__img', imageClassName)}
        priority={priority}
        sizes="(max-width: 640px) 200px, 280px"
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn('brand-logo inline-block transition-opacity hover:opacity-90', className)}
        aria-label="ESB PowerLine — return to public site"
      >
        {content}
      </Link>
    );
  }

  return <span className={cn('brand-logo inline-block', className)}>{content}</span>;
}