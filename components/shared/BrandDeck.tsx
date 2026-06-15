import { cn } from '@/lib/utils';

type BrandDeckProps = {
  className?: string;
};

export function BrandDeck({ className }: BrandDeckProps) {
  return (
    <div className={cn('brand-deck', className)}>
      <p className="brand-deck__kicker">News portal &amp; magazine</p>
      <p className="brand-deck__lede">
        <span className="brand-deck__em">Bangladesh&apos;s power sector news portal</span>
        {' '}and the{' '}
        <span className="brand-deck__em">ESB PowerLine monthly magazine</span>
        — daily reporting, sector data, and analysis from generation and grid to policy and
        projects.
      </p>
    </div>
  );
}