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
        <div className="space-y-10 pt-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
              Publishing & Operations Team
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto font-light leading-relaxed">
              Meet the professionals managing Bangladesh's premier energy news wire, quarterly data briefs, and monthly magazine.
            </p>
          </div>
          
          {/* Top Level: Editor & Publisher */}
          <div className="max-w-xl mx-auto">
            <div className="relative group overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/30 to-card/10 p-6 md:p-8 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-primary/5">
              <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center font-display font-black text-3xl shadow-md shrink-0 ring-4 ring-rose-500/10">
                  FA
                </div>
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-display font-extrabold text-xl tracking-tight text-foreground">
                        Farid Uddin Ahmed
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                        <Award className="h-3 w-3" /> Founder
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                      Editor & Publisher
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    Directing the strategic editorial vision, publisher relations, and executive interviews for ESB PowerLine across Bangladesh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Core Operational Team */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Faisal Al Mahmud — Designer */}
            <div className="relative group overflow-hidden rounded-2xl border border-border/40 bg-card/15 p-5 hover:border-violet-500/40 transition-all duration-300 shadow-md hover:shadow-violet-500/5">
              <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 rounded-bl-full -mr-6 -mt-6 blur-xl group-hover:bg-violet-500/10 transition-colors" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-display font-bold text-xl shadow shrink-0 ring-4 ring-violet-500/10">
                  FM
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <h4 className="font-semibold text-base text-foreground group-hover:text-violet-400 transition-colors truncate">
                      Faisal Al Mahmud
                    </h4>
                    <p className="text-[11px] font-bold text-violet-500 uppercase tracking-widest mt-0.5">
                      Designer
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    Directs the visual identity across all platforms, designing motion graphics, corporate logos, marketing banners, and managing the overall aesthetic of our monthly magazine.
                  </p>
                </div>
              </div>
            </div>

            {/* Mehedi Hasan Hamim — Sub-Editor */}
            <div className="relative group overflow-hidden rounded-2xl border border-border/40 bg-card/15 p-5 hover:border-blue-500/40 transition-all duration-300 shadow-md hover:shadow-blue-500/5">
              <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-bl-full -mr-6 -mt-6 blur-xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 text-white flex items-center justify-center font-display font-bold text-xl shadow shrink-0 ring-4 ring-blue-500/10">
                  MH
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <h4 className="font-semibold text-base text-foreground group-hover:text-blue-400 transition-colors truncate">
                      Mehedi Hasan Hamim
                    </h4>
                    <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                      Sub-Editor
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    Leads content curation and energy sector research, tracking policy revisions, aggregating data points, and compiling valuable briefs for the monthly publications.
                  </p>
                </div>
              </div>
            </div>

            {/* Obaidul Haque — Assistant Manager & Accounting */}
            <div className="relative group overflow-hidden rounded-2xl border border-border/40 bg-card/15 p-5 hover:border-amber-500/40 transition-all duration-300 shadow-md hover:shadow-amber-500/5">
              <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-bl-full -mr-6 -mt-6 blur-xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center font-display font-bold text-xl shadow shrink-0 ring-4 ring-amber-500/10">
                  OH
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <h4 className="font-semibold text-base text-foreground group-hover:text-amber-400 transition-colors truncate">
                      Obaidul Haque
                    </h4>
                    <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">
                      Assistant Manager & Accounting
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    Manages corporate finance, billing ledgers, and operational logistics, acting as a direct representative for key face-to-face deals and business relations.
                  </p>
                </div>
              </div>
            </div>

            {/* Riazul Islam — Chief Information Security Officer (CISO) */}
            <div className="relative group overflow-hidden rounded-2xl border border-border/40 bg-card/15 p-5 hover:border-emerald-500/40 transition-all duration-300 shadow-md hover:shadow-emerald-500/5">
              <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-bl-full -mr-6 -mt-6 blur-xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-display font-bold text-xl shadow shrink-0 ring-4 ring-emerald-500/10">
                  RI
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <h4 className="font-semibold text-base text-foreground group-hover:text-emerald-400 transition-colors truncate">
                      Riazul Islam
                    </h4>
                    <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                      CISO (Hosting & Infrastructure)
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    Administers cloud hosting systems, secure domain infrastructure, network routing stability, and enforces platform-wide security compliance.
                  </p>
                </div>
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
