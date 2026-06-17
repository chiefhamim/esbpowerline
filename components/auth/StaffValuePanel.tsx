import {
  BarChart3,
  FileText,
  ScrollText,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

const STAFF_CAPABILITIES = [
  { icon: Shield, label: 'Admin dashboard' },
  { icon: FileText, label: 'Editorial CMS' },
  { icon: BarChart3, label: 'Platform analytics' },
  { icon: Users, label: 'User management' },
  { icon: ScrollText, label: 'Activity logs' },
  { icon: Settings, label: 'System settings' },
] as const;

/** Staff capabilities — left column, under news portal & magazine copy. */
export function StaffValuePanel() {
  return (
    <section className="login-member-perks" aria-labelledby="staff-capabilities-heading">
      <h3 id="staff-capabilities-heading" className="login-member-perks__title">
        Staff workspace access
      </h3>
      <ul className="login-member-perks__list">
        {STAFF_CAPABILITIES.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label} className="login-member-perk">
              <span className="login-member-perk__icon" aria-hidden>
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="login-member-perk__label">{item.label}</span>
            </li>
          );
        })}
      </ul>
      <p className="login-member-perks__note">
        Role-based routing · Admins and editors land in the right workspace
      </p>
    </section>
  );
}