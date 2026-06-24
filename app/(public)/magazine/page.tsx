import Link from 'next/link';
import { ArrowRight, Download, Calendar, Users } from 'lucide-react';
import { getLatestMagazineIssue } from '@/lib/category-content';
import { MagazineCoverMockup } from '@/components/news/MagazineCoverMockup';
import { auth } from '@/lib/auth';
import { getMagazineSavedState } from '@/lib/actions/members';
import { SaveMagazineButton } from '@/components/members/SaveMagazineButton';

export const revalidate = 60;

export const metadata = {
  title: 'Monthly Magazine | ESB PowerLine',
  description: 'Read the latest issue of ESB PowerLine — in-depth analysis, data and features on Bangladesh energy & power.',
};

export default async function MagazinePage() {
  const issue = await getLatestMagazineIssue();
  const session = await auth();
  const signedIn = !!session?.user?.id;
  const saved = issue && signedIn ? await getMagazineSavedState(issue.id) : false;

  const magazine = issue ?? {
    id: '',
    title: 'ESB PowerLine Monthly',
    summary: 'In-depth analysis on Bangladesh power sector policy, projects and data.',
    coverUrl: '/images/demo_magazine_cover.jpg',
    pdfUrl: null,
    issueDate: new Date(),
  };

  const issueLabel = magazine.issueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  const features = [
    { title: 'Solar + Wind Pipeline 2026–2030', excerpt: 'Full project map and tender calendar for utility-scale renewables.' },
    { title: 'Cross-Border Trade Update', excerpt: 'India–Bangladesh power flows, new HVDC links, and pricing mechanics.' },
    { title: 'BERC Tariff Reform Deep Dive', excerpt: 'How the new bulk supply tariff affects generators, DISCOs and consumers.' },
    { title: 'Rooppur Commissioning Timeline', excerpt: 'Inside the first nuclear fuel loading and grid integration milestones.' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Full-Page Ambient Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] rounded-full bg-emerald-500/5 blur-[130px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[20%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-primary/4 blur-[120px] animate-pulse duration-[12000ms]" />
      </div>
      <div className="container container--shell py-10 md:py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
          <div className="lg:w-2/5">
            <div className="sticky top-8">
              <div className="uppercase text-xs tracking-[2px] text-accent font-medium mb-1.5 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> {issueLabel} ISSUE
              </div>
              <h1 className="h2 mb-3 text-balance">{magazine.title}</h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{magazine.summary}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {signedIn && magazine.pdfUrl ? (
                  <a href={magazine.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary gap-2 px-5">
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                ) : magazine.pdfUrl ? (
                  <Link href="/members/login?callbackUrl=/magazine" className="btn btn-primary gap-2 px-5">
                    <Download className="h-4 w-4" /> Member login to download
                  </Link>
                ) : (
                  <button type="button" className="btn btn-primary gap-2 px-5" disabled>
                    <Download className="h-4 w-4" /> PDF coming soon
                  </button>
                )}
                {signedIn && issue ? (
                  <SaveMagazineButton magazineId={issue.id} initialSaved={saved} />
                ) : null}
                <Link href="/articles" className="btn btn-secondary">Browse related articles</Link>
                {signedIn ? (
                  <Link href="/members/magazine" className="btn btn-secondary">Full archive</Link>
                ) : null}
              </div>

              <div className="mt-8 text-xs text-muted-foreground/80 flex items-center gap-4">
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> 18,400 readers</div>
                <div>Vol. 04 • Issue 06</div>
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 flex flex-col items-center">
            <MagazineCoverMockup coverUrl={magazine.coverUrl} />
            <div className="text-center mt-3 text-[10px] text-muted-foreground/70">Print • Digital • Archive access for members</div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-xl">In this issue</h2>
            <Link href="/articles" className="text-xs text-primary hover:underline flex items-center gap-1">All power sector features <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {features.map((f, idx) => (
              <div key={idx} className="card p-6 group hover:border-primary/50 transition-all duration-200 relative overflow-hidden">
                {/* Subtle card glow */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                  <div className="absolute -top-[30%] -right-[30%] w-[10rem] h-[10rem] rounded-full bg-emerald-500/6 blur-[30px]" />
                  <div className="absolute -bottom-[30%] -left-[30%] w-[10rem] h-[10rem] rounded-full bg-primary/4 blur-[30px]" />
                </div>
                <div className="uppercase text-accent text-xs tracking-widest font-semibold mb-1.5">FEATURE</div>
                <h4 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.excerpt}</p>
                <div className="text-[11px] mt-4 text-muted-foreground/80">12 pages • Analysis + Data</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border/70 p-8 bg-muted/30 text-center">
          <div className="max-w-md mx-auto">
            <div className="font-semibold text-lg mb-2">Access the full archive + exclusive briefings</div>
            <p className="text-sm text-muted-foreground mb-5">Monthly magazine + data packages for energy professionals.</p>
            {signedIn ? (
              <Link href="/members" className="btn btn-primary px-8">Open my library</Link>
            ) : (
              <Link href="/members/login" className="btn btn-primary px-8">Sign in for full access</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}