import Link from 'next/link';
import { Award, ShieldCheck, FileText, Users } from 'lucide-react';
import { getServerSiteLocale } from '@/lib/locale-server';
import { createTranslator } from '@/lib/i18n/messages';

export default async function AboutPage() {
  const locale = await getServerSiteLocale();
  const t = createTranslator(locale);

  return (
    <div className="container container--shell py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            {t('brand.kicker')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight">
            ESB PowerLine
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            {t('portal.mastheadTagline')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          <div className="card p-6 border border-border/40 bg-card/25 rounded-2xl hover:border-primary/30 transition-all group">
            <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-105 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Authoritative Coverage</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Serving the energy value chain with comprehensive updates from ministries, utilities, IPPs, and stakeholders.
            </p>
          </div>

          <div className="card p-6 border border-border/40 bg-card/25 rounded-2xl hover:border-primary/30 transition-all group">
            <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Policy & Regulatory Focus</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Detailed tracking of BERC tariff orders, Ministry masterplans, cross-border imports, and public hearings.
            </p>
          </div>

          <div className="card p-6 border border-border/40 bg-card/25 rounded-2xl hover:border-primary/30 transition-all group">
            <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-105 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Monthly Magazine</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deep dives, sector data reports, project checklists, and executive interviews in our digital print edition.
            </p>
          </div>
        </div>

        {/* Brand Mission & Story */}
        <div className="border border-border/40 bg-card/10 rounded-3xl p-8 md:p-12 space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Our Mission</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg font-light">
            <p>
              Founded with the commitment to provide accurate and timely energy journalism, 
              <strong> ESB PowerLine</strong> stands as a primary beacon for Bangladesh's power and energy sectors. 
              We bring transparent visibility into capacity management, fuel supply realities, tariff reform, 
              and the transition toward clean, sustainable energy options.
            </p>
            <p>
              Our publications, both in digital news wire formats and our monthly subscription-based magazine, 
              are curated for utility executives, regulatory officers, IPP investors, policy analysts, and 
              stakeholders shaping the nation's energy future.
            </p>
          </div>
        </div>

        {/* Leadership & Publishing Team */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center">Publishing & Editorial</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/30 bg-card/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase shrink-0">
                FA
              </div>
              <div>
                <h4 className="font-semibold text-base">Farid Uddin Ahmed</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                  Editor & Publisher
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/30 bg-card/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase shrink-0">
                ES
              </div>
              <div>
                <h4 className="font-semibold text-base">Editorial Staff</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                  Senior energy correspondents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-8 space-y-4">
          <h3 className="text-lg font-semibold">Ready to explore further?</h3>
          <div className="flex justify-center gap-4">
            <Link href="/articles" className="btn btn--primary">
              Read Latest News
            </Link>
            <Link href="/contact" className="btn border border-border hover:bg-muted text-foreground">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
