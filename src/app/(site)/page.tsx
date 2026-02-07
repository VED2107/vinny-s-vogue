import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import { HeroSection } from '@/components/home/HeroSection';
import { ImageRevealSection } from '@/components/home/ImageRevealSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { StorySection } from '@/components/home/StorySection';
import { CTASection } from '@/components/home/CTASection';
import { ContactSection } from '@/components/home/ContactSection';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <main>
      <HeroSection userEmail={user?.email ?? null} logoutAction={logout} />
      <ImageRevealSection />
      <FeaturedSection />
      <StorySection />
      <ContactSection />
      <CTASection />
    </main>
  );
}
