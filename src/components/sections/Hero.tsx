import Link from "next/link";
import { ArrowRight } from "lucide-react";

function AvatarStack() {
  const avatars = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=64&h=64&fit=crop",
  ];

  return (
    <div className="flex items-center">
      {avatars.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          className="w-5 h-5 lg:w-4 lg:h-4 rounded-full border-2 border-white object-cover flex-shrink-0"
          style={{ marginLeft: i === 0 ? 0 : -10 }}
        />
      ))}
    </div>
  );
}

const HERO_IMAGES = [
  { src: "/assets/Heroimages/Hero1.jpg", alt: "Professionals in a discussion" },
  { src: "/assets/Heroimages/Hero2.jpg", alt: "Team celebrating" },
  { src: "/assets/Heroimages/Hero3.jpg", alt: "Conference event" },
  { src: "/assets/Heroimages/Hero4.jpg", alt: "Networking professionals" },
  { src: "/assets/Heroimages/Hero5.jpg", alt: "Professionals talking" },
  { src: "/assets/Heroimages/Hero1.jpg", alt: "Professionals in a discussion" },
  { src: "/assets/Heroimages/Hero2.jpg", alt: "Team celebrating" },
  { src: "/assets/Heroimages/Hero3.jpg", alt: "Conference event" },
  { src: "/assets/Heroimages/Hero4.jpg", alt: "Networking professionals" },
  { src: "/assets/Heroimages/Hero5.jpg", alt: "Professionals talking" },
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden min-h-[85vh] sm:min-h-0 flex flex-col"
      style={{
        backgroundColor: "#0F0C17",
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
      }}
    >
      {/* Global animation keyframes for this section */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade {
          opacity: 0;
          animation: heroFadeUp 0.6s ease-out forwards;
        }
        .hero-fade-1 { animation-delay: 0.05s; }
        .hero-fade-2 { animation-delay: 0.15s; }
        .hero-fade-3 { animation-delay: 0.25s; }
        .hero-fade-4 { animation-delay: 0.35s; }

        @keyframes scrollStrip {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .strip-track {
          animation: scrollStrip 60s linear infinite;
          will-change: transform;
        }
        .strip-track:hover {
          animation-play-state: paused;
        }
        .strip-card {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .strip-card:hover {
          transform: translateY(-14px);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade {
            animation: none;
            opacity: 1;
          }
          .strip-track {
            animation: none;
          }
        }
      `}</style>

      {/* Side graphic — real SVG file, desktop only, fills right half of hero like the old dot pattern did */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/MAP3.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-2/6 h-full pointer-events-none hidden md:block object-cover object-right"
        style={{
          maskImage: "linear-gradient(to left, rgba(0,0,0,1) 20%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 20%, transparent 80%)",
        }}
      />

      {/* Corner accent graphic — mobile only, sits on top of the background, behind the text content */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/MAP1.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 w-32 h-full pointer-events-none md:hidden opacity-80"
      />

      {/* Content container — px-3 on mobile to maximise width on narrow screens */}
      <div className="w-full max-w-5xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 p-14 md:pt-12 sm:pt-16 lg:pt-10 pb-0 relative z-10">

        {/* Pill badge */}
        <div className="flex justify-center sm:justify-start mb-12 hero-fade hero-fade-1">
          <div className="inline-flex items-center px-4 lg:py-2 md:px-2 py-1.5 gap-2 rounded-full border border-white/90 bg-[linear-gradient(249.63deg,#62577E_33.5%,#FFCA68_129.7%)]">
            <AvatarStack />
            <span className="text-white text-[12px] lg:text-[10px] font-medium whitespace-nowrap">
              10k+ Professionals
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="w-full max-w-xs mx-auto sm:mx-0 text-white font-bold leading-tight mb-4 text-balance text-center sm:text-left sm:max-w-3xl hero-fade hero-fade-2"
          style={{
            fontSize: "clamp(2.35rem, 3.5vw, 2.75rem)",
            lineHeight: "1.20",
            letterSpacing: "-0.00em",
          }}
        >
          Connect. Grow. Thrive{" "}
          <span className="sm:hidden">with Christian Professionals</span>
          <span className="hidden sm:inline">
            <br />
            with Christian Professionals
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="w-full max-w-xs mx-auto sm:mx-0 text-white text-sm font-medium lg:text-xl leading-relaxed mb-8 text-center sm:text-left sm:max-w-3xl md:max-w-lg hero-fade hero-fade-3"
          style={{ letterSpacing: "0.02em" }}
        >
          Build your profile, connect with mentors, join groups, and unlock
          career opportunities in a faith-centered community.
        </p>

        {/* CTAs */}
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-10 sm:mb-12 hero-fade hero-fade-4">
          {/* <Link
            href="#groups"
            className="w-full max-w-xs sm:max-w-none sm:w-auto inline-flex items-center justify-center bg-white text-navy font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Join Community
          </Link> */}
          <Link
            href="#groups"
            className="group w-full max-w-xs sm:max-w-none sm:w-auto inline-flex items-center justify-center gap-2 border border-white/40 bg-white text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Explore Groups
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </Link>
        </div>
      </div>

      {/* Hero image strip — pushed to bottom on mobile */}
      <div className="relative py-10 lg:py-1 pb-14 mt-auto sm:mt-0" style={{ overflowX: "hidden" }}>
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-5 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0B0E14, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-5 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, #0B0E14)" }}
        />

        <div className="strip-track flex gap-6 pt-4 lg:pb-5" style={{ width: "max-content" }}>
          {[...HERO_IMAGES, ...HERO_IMAGES].map((img, idx) => (
            <div
              key={idx}
              className="strip-card flex-shrink-0 rounded-t-2xl overflow-hidden"
              style={{
                width: "clamp(190px, 28vw, 280px)",
                height: "clamp(130px, 22vw, 220px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading={idx < HERO_IMAGES.length && idx === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}