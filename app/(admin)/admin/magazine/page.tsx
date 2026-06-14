import { PageHeader } from '@/components/dashboard/PageHeader';
import { getMagazineIssues } from '@/lib/actions/magazine';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

export default async function AdminMagazinePage() {
  const issues = await getMagazineIssues();
  return (
    <div>
      <PageHeader title="Magazine Issues" description="Manage monthly ESB PowerLine magazine editions" />
      <div className="card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">{issue.title}</TableCell>
                <TableCell>{new Date(issue.issueDate).toLocaleDateString()}</TableCell>
                <TableCell><StatusBadge status={issue.status.toUpperCase()} /></TableCell>
                <TableCell className="text-muted-foreground text-sm line-clamp-1">{issue.summary}</TableCell>
              </TableRow>
            ))}
            {issues.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-muted-foreground">No magazine issues yet. Seed the database to populate.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}