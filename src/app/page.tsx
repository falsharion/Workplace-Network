import { supabase } from "@/lib/supabase";
import {
  FALLBACK_FEATURED_EVENT,
  FALLBACK_CURATED_EVENTS,
  FALLBACK_MENTORS,
  FALLBACK_MEMBER_STORIES,
  FALLBACK_ARTICLES,
} from "@/lib/fallback-data";
import { getPublicExperienceGroups } from "@/lib/groups.server";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { AboutUs, AboutUsIntro, AboutUsBody } from "@/components/sections/AboutUs";
import { MeetOurMentors } from "@/components/sections/MeetOurMentors";
import { FeaturesBanner } from "@/components/sections/FeaturesBanner";
import { CommunityGroups } from "@/components/sections/CommunityGroups";
import { WhyWorkplaceNetwork } from "@/components/sections/WhyWorkplaceNetwork";
import { FeaturedEvent } from "@/components/sections/FeaturedEvent";
// import { CuratedEvents } from "@/components/sections/CuratedEvents";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { MemberStories } from "@/components/sections/MemberStories";
// import { JoinCTA } from "@/components/sections/JoinCTA";
import { FAQ } from "@/components/sections/FAQ";
// import { LatestArticles } from "@/components/sections/LatestArticles";
import { Footer } from "@/components/Footer";
import { Blob } from "@/components/Blob";

export const revalidate = 300;

async function getData() {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  // Experience groups have their own configured-check + fallback built in,
  // and only ever return display-safe fields (no whatsapp link).
  const experienceGroups = await getPublicExperienceGroups();

  if (!isSupabaseConfigured) {
    return {
      featuredEvent: FALLBACK_FEATURED_EVENT,
      curatedEvents: FALLBACK_CURATED_EVENTS,
      mentors: FALLBACK_MENTORS,
      groups: experienceGroups,
      memberStories: FALLBACK_MEMBER_STORIES,
      articles: FALLBACK_ARTICLES,
    };
  }

  const [
    { data: featuredEvent },
    { data: allEvents },
    { data: mentors },
    { data: memberStories },
    { data: articles },
  ] = await Promise.all([
    supabase.from("events").select("*").eq("is_featured", true).single(),
    supabase
      .from("events")
      .select("*")
      .eq("is_featured", false)
      .order("start_at", { ascending: true }),
    supabase.from("mentors").select("*").order("id"),
    supabase.from("member_stories").select("*").order("id"),
    supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  return {
    featuredEvent: featuredEvent ?? FALLBACK_FEATURED_EVENT,
    curatedEvents: allEvents ?? FALLBACK_CURATED_EVENTS,
    mentors: mentors?.length ? mentors : FALLBACK_MENTORS,
    groups: experienceGroups,
    memberStories: memberStories?.length ? memberStories : FALLBACK_MEMBER_STORIES,
    articles: articles?.length ? articles : FALLBACK_ARTICLES,
  };
}

export default async function HomePage() {
  const {
    featuredEvent,
    curatedEvents,
    mentors,
    groups,
    memberStories,
    articles,
  } = await getData();

  return (
    <>
      <section className="relative overflow-hidden">
         {/* <Blob className="bottom-[272rem] left-10 md:hidden" size={280} colorFrom="#f97316" colorTo="#facc15" opacity={0.25}/> */}
      <Blob className="bottom-[242rem] left-5 md:hidden" size={150} colorFrom="#f97316" colorTo="#facc15" opacity={0.5} />
      <Navbar />
      <main>
        <Hero />

        <section id="about" className="bg-white scroll-mt-20">
          <div className="w-full max-w-5xl mx-auto md:max-w-2xl lg:max-w-4xl px-7 sm:px-6 lg:px-8 py-12 sm:py-16">

            {/* md+ : original two-column About Us, then mentors below */}
            <div className="hidden md:block">
              <AboutUs />
              <div className="mt-10 sm:mt-14">
                <MeetOurMentors mentors={mentors} />
              </div>
            </div>

            {/* mobile: About intro → Mentors → About body */}
            <div className="md:hidden space-y-10">
              <AboutUsIntro />
              <MeetOurMentors mentors={mentors} />
              <AboutUsBody />
            </div>

          </div>
        </section>
        <FeaturesBanner />
        <div className="max-w-5xl w-full lg:max-w-4xl  bg-white mx-auto px-7 sm:px-6 lg:px-8 py-12 sm:py-16">
          <CommunityGroups groups={groups} />
          <WhyWorkplaceNetwork />
        </div>
        <div style={{ backgroundColor: '#0B0E14' }}>
        <FeaturedEvent event={featuredEvent} /></div>
        {/* <CuratedEvents events={curatedEvents} /> */}
        <TestimonialCarousel />
        <MemberStories stories={memberStories} />
        {/* <JoinCTA /> */}
        <FAQ />
        {/* <LatestArticles articles={articles} /> */}
      </main>
      <Footer />
      </section>
    </>
  );
}