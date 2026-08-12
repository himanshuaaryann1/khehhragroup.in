import { useEffect, useRef, useState } from "react";
import { ArrowRight, PhoneCall } from "lucide-react";

const stats = [
  { value: "9+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "1000+", label: "Properties Sold" },
  { value: "5.0", label: "Google Rating" },
];

const JustdialIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="h-5 w-5">
    <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <text
      x="12"
      y="15.5"
      textAnchor="middle"
      fill="currentColor"
      fontSize="7.8"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      letterSpacing="-0.6"
    >
      JD
    </text>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="h-5 w-5">
    <defs>
      <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="5%" stopColor="#fa7e1e" />
        <stop offset="45%" stopColor="#d92e7f" />
        <stop offset="60%" stopColor="#9b36b7" />
        <stop offset="90%" stopColor="#515bd4" />
      </linearGradient>
    </defs>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="url(#ig-gradient)" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#ig-gradient)" strokeWidth="1.6" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="url(#ig-gradient)" />
  </svg>
);

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  }, []);

  return (
    <section id="home" className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-navy text-white">
      {/* Media layer */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/videos/7578552/apartment-architecture-at-home-business-7578552.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920"
          alt="Premium home interior with natural light, showcasing modern living space"
          className={`h-full w-full object-cover transition-opacity duration-1000 ${loaded ? "opacity-0" : "opacity-100"}`}
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setLoaded(true)}
          poster="https://images.pexels.com/videos/7578552/apartment-architecture-at-home-business-7578552.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920"
        >
          <source
            src="/hero-interior.mp4"
            type="video/mp4"
          />
        </video>
        {/* Elegant overlay for readability, keeps video dominant */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-40 sm:px-8 sm:pb-20 lg:px-10">
        <p className="reveal is-visible text-[11px] font-semibold uppercase tracking-[0.4em] text-champagne">
          Batala, Punjab &middot; Est. 2017
        </p>

        <h1 className="reveal is-visible mt-6 max-w-3xl font-display text-[2.4rem] font-medium leading-[1.04] text-balance sm:text-5xl lg:text-[4rem]">
          Thanks for Visiting
          <br />
          Khehhra Group
        </h1>

        <p className="reveal is-visible mt-4 max-w-2xl text-[1.05rem] font-medium leading-snug text-white/90 sm:text-[1.3rem] lg:text-[1.45rem]">
          Your Trusted Property Partner in Batala
        </p>

        <p className="reveal is-visible mt-4 max-w-xl font-display text-[1.05rem] font-medium leading-[1.35] tracking-[0.06em] text-champagne/95 sm:text-[1.2rem] lg:text-[1.45rem]">
          BUILDING LANDMARKS. GROWING LEGACIES.
        </p>

        <div className="reveal is-visible mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#properties"
            className="group inline-flex items-center gap-2 rounded-full bg-champagne px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-navy shadow-xl shadow-black/20 transition-transform hover:-translate-y-0.5"
          >
            Explore Properties
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#intent"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/15"
          >
            Find My Property
          </a>
          <a
            href="tel:08269000066"
            className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold uppercase tracking-wider text-white/90 underline decoration-champagne/60 underline-offset-4 transition-colors hover:text-champagne"
          >
            <PhoneCall size={16} />
            Talk to an Expert
          </a>
        </div>

        {/* Social Links Container */}
        <div className="reveal is-visible mt-6 flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-5 rounded-[14px] border border-white/15 bg-white/[0.04] px-6 py-3 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.07]">
            <a
              href="https://jsdl.in/DT-9993KABGLAG"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Khehhra Group on Justdial"
              title="Visit us on Justdial"
              className="inline-flex items-center justify-center text-champagne/90 transition-all hover:text-champagne hover:scale-110"
            >
              <JustdialIcon />
            </a>
            <div className="h-5 w-px bg-white/10" />
            <a
              href="https://www.instagram.com/shamsherr_ssiingh/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Khehhra Group on Instagram"
              title="Visit us on Instagram"
              className="inline-flex items-center justify-center transition-all hover:scale-110"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* Trust strip */}
        <div className="reveal is-visible mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-7">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              <div>
                <div className="font-display text-2xl font-semibold text-champagne sm:text-3xl">{s.value}</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">{s.label}</div>
              </div>
              {i < stats.length - 1 && <div className="hidden h-9 w-px bg-white/20 sm:block" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
