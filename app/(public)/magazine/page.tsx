import Link from 'next/link';
import { ArrowRight, Download, Calendar, Users } from 'lucide-react';
import { getLatestMagazineIssue } from '@/lib/category-content';
import { MagazineCoverMockup } from '@/components/news/MagazineCoverMockup';

export const metadata = {
  title: 'Monthly Magazine | ESB PowerLine',
  description: 'Read the latest issue of ESB PowerLine — in-depth analysis, data and features on Bangladesh energy & power.',
};

export default async function MagazinePage() {
  const issue = await getLatestMagazineIssue();
  const magazine = issue ?? {
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
    <div className="min-h-screen">
      <div className="container py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/5">
            <div className="sticky top-8">
              <div className="uppercase text-xs tracking-[2px] text-accent font-medium mb-1.5 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> {issueLabel} ISSUE
              </div>
              <h1 className="h2 mb-3 text-balance">{magazine.title}</h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{magazine.summary}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {magazine.pdfUrl ? (
                  <a href={magazine.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary gap-2 px-5">
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                ) : (
                  <button type="button" className="btn btn-primary gap-2 px-5" disabled>
                    <Download className="h-4 w-4" /> PDF coming soon
                  </button>
                )}
                <Link href="/articles" className="btn btn-secondary">Browse related articles</Link>
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

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, idx) => (
              <div key={idx} className="card p-6 group hover:border-primary/50 transition-all duration-200">
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
            <Link href="/members/login" className="btn btn-primary px-8">Sign in for full access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}