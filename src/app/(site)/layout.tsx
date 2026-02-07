import { SiteLayout } from '@/components/layout/SiteLayout';

export default async function SiteGroupLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
