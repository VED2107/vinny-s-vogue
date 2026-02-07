import { requireAdmin } from '@/lib/auth';
import { AdminShell } from '@/components/layout/AdminShell';

export default async function StudioAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
