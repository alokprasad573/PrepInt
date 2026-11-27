import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { APP_FEATURES } from "../utils/data";

import { LuSparkles, LuArrowRight, LuChevronDown } from "react-icons/lu";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Modal from "../components/Modal";
import SplitTextLines from "../components/SplitTextLines";

import { HERO_IMAGE } from "../utils/apiPaths";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/cards/ProfileInfoCard";
import {
  gsap,
  MOTION_TOKENS,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
  attachHoverLift,
  attachPressFeedback,
} from "../animations";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const pageRef = useRef(null);
  const ambientGlowRef = useRef(null);
  const headerRef = useRef(null);
  const brandLogoRef = useRef(null);
  const navActionRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroHighlightRef = useRef(null);
  const heroHighlightBarRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroCtaGroupRef = useRef(null);

  const heroSectionRef = useRef(null);
  const heroScrollRef = useRef(null);
  const heroShowcaseEntranceRef = useRef(null);
  const heroParallaxRef = useRef(null);
  const heroFloatRef = useRef(null);
  const heroGlowRef = useRef(null);

  const featuresSectionRef = useRef(null);
  const featuresHeaderRef = useRef(null);
  const footerRef = useRef(null);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/workspace");
    }
  };

  const handleScrollToFeatures = () => {
    const target = featuresSectionRef.current;
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia(pageRef.current);

    mm.add(
      {
        isDesktop:
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        isTablet:
          "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        isMobile:
          "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        isFinePointer: "(hover: hover) and (pointer: fine)",
        isReduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isTablet, isMobile, isFinePointer, isReduced } =
          context.conditions;

        const heroLines = gsap.utils.toArray(
          ".hero-line-inner",
          pageRef.current,
        );
        const heroCtas = gsap.utils.toArray(".hero-cta", heroCtaGroupRef.current);
        const featureCards = gsap.utils.toArray(
          ".feature-card",
          featuresSectionRef.current,
        );
        const featureHeaderItems = featuresHeaderRef.current
          ? Array.from(featuresHeaderRef.current.children)
          : [];

        if (isReduced) {
          gsap.set(
            [
              ambientGlowRef.current,
              headerRef.current,
              brandLogoRef.current,
              navActionRef.current,
              heroBadgeRef.current,
              ...heroLines,
              heroHighlightRef.current,
              heroHighlightBarRef.current,
              heroDescRef.current,
              ...heroCtas,
              heroShowcaseEntranceRef.current,
              heroParallaxRef.current,
              heroFloatRef.current,
              ...featureHeaderItems,
              ...featureCards,
              footerRef.current,
            ].filter(Boolean),
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              scaleX: 1,
              yPercent: 0,
              rotationX: 0,
              rotationY: 0,
              clearProps: "transform",
            },
          );
          return undefined;
        }

        const cleanups = [];
        const distanceScale = isMobile ? 0.55 : isTablet ? 0.8 : 1;

        // 1. Coordinated Hero Entrance Timeline
        const heroTl = gsap.timeline({
          defaults: { ease: MOTION_TOKENS.ease.out },
        });

        heroTl
          .fromTo(
            ambientGlowRef.current,
            { opacity: 0, scale: 0.72 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.05,
              ease: MOTION_TOKENS.ease.out,
            },
            0,
          )
          .fromTo(
            headerRef.current,
            { y: -16 * distanceScale, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: MOTION_TOKENS.ease.out,
              clearProps: "transform",
            },
            0.06,
          )
          .fromTo(
            brandLogoRef.current,
            { scale: 0.88, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.55,
              ease: MOTION_TOKENS.ease.cinematic,
              clearProps: "transform",
            },
            0.14,
          )
          .fromTo(
            navActionRef.current,
            { y: -8 * distanceScale, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: MOTION_TOKENS.ease.out,
              clearProps: "transform",
            },
            0.2,
          )
          .fromTo(
            heroBadgeRef.current,
            { y: 14 * distanceScale, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: MOTION_TOKENS.ease.out,
              clearProps: "transform",
            },
            0.22,
          )
          .fromTo(
            heroLines,
            { yPercent: 112, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: isMobile ? 0.65 : 0.84,
              stagger: MOTION_TOKENS.stagger.hero,
              ease: MOTION_TOKENS.ease.text,
              clearProps: "transform",
            },
            0.3,
          )
          .fromTo(
            heroHighlightRef.current,
            { opacity: 0.4 },
            {
              opacity: 1,
              duration: 0.5,
              ease: MOTION_TOKENS.ease.smooth,
            },
            0.52,
          )
          .fromTo(
            heroHighlightBarRef.current,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.68,
              ease: MOTION_TOKENS.ease.cinematic,
            },
            0.56,
          )
          .fromTo(
            heroDescRef.current,
            { y: 20 * distanceScale, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: isMobile ? 0.55 : 0.72,
              ease: MOTION_TOKENS.ease.out,
              clearProps: "transform",
            },
            0.44,
          )
          .fromTo(
            heroCtas,
            { y: 16 * distanceScale, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.55,
              stagger: MOTION_TOKENS.stagger.base,
              ease: MOTION_TOKENS.ease.out,
              clearProps: "transform",
            },
            0.56,
          )
          .fromTo(
            heroShowcaseEntranceRef.current,
            {
              opacity: 0,
              y: isMobile ? 20 : 38,
              scale: isMobile ? 0.96 : 0.93,
              rotationX: isMobile ? 0 : 6,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: isMobile ? 0.7 : 0.98,
              ease: MOTION_TOKENS.ease.cinematic,
              clearProps: "transform",
            },
            0.54,
          );

        // 2. Ambient Breath & Subtle Showcase Floating (Desktop & Tablet only)
        if (isDesktop) {
          gsap.to(ambientGlowRef.current, {
            scale: 1.07,
            opacity: 0.88,
            duration: MOTION_TOKENS.duration.ambient,
            repeat: -1,
            yoyo: true,
            ease: MOTION_TOKENS.ease.breath,
            delay: 1.35,
          });
        }

        if (isDesktop || isTablet) {
          gsap.to(heroFloatRef.current, {
            y: isDesktop ? -6 : -3.5,
            duration: 4.4,
            repeat: -1,
            yoyo: true,
            ease: MOTION_TOKENS.ease.breath,
            delay: 1.55,
          });

          // Scroll-linked Showcase Depth Parallax
          gsap.fromTo(
            heroScrollRef.current,
            { y: 0 },
            {
              y: isDesktop ? -26 : -14,
              ease: "none",
              scrollTrigger: {
                trigger: pageRef.current,
                start: "top top",
                end: "+=720",
                scrub: 0.85,
              },
            },
          );
        }

        // 3. Mouse-driven 3D Parallax on Desktop / Fine-Pointer Tablet
        if ((isDesktop || isTablet) && isFinePointer && heroSectionRef.current) {
          const container = heroSectionRef.current;
          const parallaxEl = heroParallaxRef.current;
          const glowEl = heroGlowRef.current;
          const intensity = isDesktop ? 1 : 0.45;

          gsap.set(parallaxEl, {
            transformPerspective: 1400,
            transformStyle: "preserve-3d",
          });

          const rotXTo = gsap.quickTo(parallaxEl, "rotationX", {
            duration: 0.55,
            ease: "power3.out",
          });
          const rotYTo = gsap.quickTo(parallaxEl, "rotationY", {
            duration: 0.55,
            ease: "power3.out",
          });
          const xTo = gsap.quickTo(parallaxEl, "x", {
            duration: 0.55,
            ease: "power3.out",
          });
          const yTo = gsap.quickTo(parallaxEl, "y", {
            duration: 0.55,
            ease: "power3.out",
          });
          const glowXTo = gsap.quickTo(glowEl, "x", {
            duration: 0.7,
            ease: "power3.out",
          });
          const glowYTo = gsap.quickTo(glowEl, "y", {
            duration: 0.7,
            ease: "power3.out",
          });

          const handleMouseMove = (event) => {
            const rect = container.getBoundingClientRect();
            const relX = (event.clientX - rect.left) / rect.width - 0.5;
            const relY = (event.clientY - rect.top) / rect.height - 0.5;

            rotYTo(relX * 5.2 * intensity);
            rotXTo(-relY * 4.2 * intensity);
            xTo(relX * 10 * intensity);
            yTo(relY * 8 * intensity);
            glowXTo(-relX * 16 * intensity);
            glowYTo(-relY * 12 * intensity);
          };

          const handleMouseLeave = () => {
            rotXTo(0);
            rotYTo(0);
            xTo(0);
            yTo(0);
            glowXTo(0);
            glowYTo(0);
          };

          container.addEventListener("mousemove", handleMouseMove);
          container.addEventListener("mouseleave", handleMouseLeave);

          cleanups.push(() => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
          });
        }

        // 4. Scroll-Triggered Features Section
        if (featureHeaderItems.length > 0) {
          gsap.fromTo(
            featureHeaderItems,
            { opacity: 0, y: 22 * distanceScale },
            {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.5 : 0.68,
              stagger: 0.08,
              ease: MOTION_TOKENS.ease.out,
              clearProps: "transform",
              scrollTrigger: {
                trigger: featuresHeaderRef.current,
                start: "top 86%",
                once: true,
              },
            },
          );
        }

        if (featureCards.length > 0) {
          if (isMobile) {
            featureCards.forEach((card) => {
              gsap.fromTo(
                card,
                { opacity: 0, y: 22, scale: 0.97 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  ease: MOTION_TOKENS.ease.out,
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    once: true,
                  },
                },
              );
            });
          } else {
            const featureRows = gsap.utils.toArray(
              ".feature-grid-row",
              featuresSectionRef.current,
            );

            featureRows.forEach((row) => {
              const rowCards = gsap.utils.toArray(".feature-card", row);
              if (rowCards.length === 0) return;

              gsap.fromTo(
                rowCards,
                { opacity: 0, y: 34, scale: 0.96 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.72,
                  stagger: MOTION_TOKENS.stagger.cards,
                  ease: MOTION_TOKENS.ease.out,
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: row,
                    start: "top 85%",
                    once: true,
                  },
                },
              );
            });
          }

          if (isFinePointer) {
            cleanups.push(
              attachHoverLift(featureCards, {
                y: -6,
                scale: 1.012,
                badgeSelector: ".feature-badge",
              }),
            );
          }
        }

        // 5. CTA Press Micro-feedback
        cleanups.push(attachPressFeedback(heroCtas));

        // 6. Subtle Footer Reveal
        if (footerRef.current) {
          gsap.fromTo(
            footerRef.current,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.58,
              ease: MOTION_TOKENS.ease.smooth,
              clearProps: "transform",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 96%",
                once: true,
              },
            },
          );
        }

        return () => {
          cleanups.forEach((fn) => fn());
        };
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="w-full min-h-screen bg-[#fafaf9] text-slate-900 selection:bg-amber-500 selection:text-white overflow-x-hidden"
    >
      {/* Top Ambient Warm Glow */}
      <div className="w-full bg-linear-to-b from-amber-50/80 via-orange-50/30 to-transparent relative pb-28 sm:pb-36 border-b border-amber-100/40">
        <div
          ref={ambientGlowRef}
          className="w-125 h-125 bg-linear-to-br from-amber-300/25 to-orange-400/20 rounded-full blur-[110px] pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 will-change-transform"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
          {/* Header */}
          <header
            ref={headerRef}
            className="flex justify-between items-center mb-16 sm:mb-20"
          >
            <div ref={brandLogoRef} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center p-2 shadow-md shadow-slate-900/10">
                <img
                  src="/prepInt.svg"
                  alt="PrepInt"
                  className="w-full h-full filter invert brightness-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  PrepInt
                </span>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
                  AI 1.5
                </span>
              </div>
            </div>

            <div ref={navActionRef}>
              {user ? (
                <ProfileInfoCard />
              ) : (
                <button
                  type="button"
                  className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-xs sm:text-sm font-semibold text-white px-6 py-2.5 rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                  onClick={() => {
                    setCurrentPage("login");
                    setOpenAuthModal(true);
                  }}
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </header>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="w-full lg:w-1/2">
              <div className="flex items-center justify-start mb-4">
                <div
                  ref={heroBadgeRef}
                  className="inline-flex items-center gap-2 text-xs text-amber-800 font-semibold bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200/80 shadow-2xs"
                >
                  <LuSparkles className="text-amber-600" />
                  <span>AI-Powered Interview Preparation Platform</span>
                </div>
              </div>

              <SplitTextLines
                as="h1"
                ariaLabel="Ace Interviews with AI-Powered Learning"
                className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 font-bold mb-6 leading-[1.15] tracking-tight"
                lines={[
                  "Ace Interviews with",
                  <span key="line-2" className="inline-block">
                    <span className="relative inline-block">
                      <span
                        ref={heroHighlightRef}
                        className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 animate-text-shine font-extrabold"
                      >
                        AI-Powered
                      </span>
                      <span
                        ref={heroHighlightBarRef}
                        aria-hidden="true"
                        className="absolute left-0 right-0 -bottom-0.5 h-1 rounded-full bg-linear-to-r from-amber-400 via-orange-500 to-amber-500 origin-left"
                      />
                    </span>{" "}
                    Learning
                  </span>,
                ]}
              />
            </div>

            <div className="w-full lg:w-1/2">
              <p
                ref={heroDescRef}
                className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed"
              >
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery — your ultimate interview toolkit is
                here.
              </p>

              <div
                ref={heroCtaGroupRef}
                className="flex flex-col sm:flex-row items-center gap-3.5"
              >
                <button
                  type="button"
                  className="hero-cta w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-linear-to-r hover:from-amber-500 hover:to-orange-600 text-sm font-semibold text-white px-8 py-3.5 rounded-xl shadow-lg shadow-slate-900/10 transition-[background-color,box-shadow] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 group"
                  onClick={handleCTA}
                >
                  <span>Get Started Free</span>
                  <LuArrowRight className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={handleScrollToFeatures}
                  className="hero-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-sm font-semibold text-slate-700 hover:text-amber-700 px-6 py-3.5 rounded-xl border border-stone-200/90 hover:border-amber-300 shadow-2xs transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                >
                  <span>Explore Features</span>
                  <LuChevronDown className="text-base text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Hero Showcase */}
      <div
        ref={heroSectionRef}
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8"
      >
        <section className="flex justify-center -mt-12 sm:-mt-20">
          <div
            ref={heroScrollRef}
            className="relative w-full max-w-5xl perspective-container"
          >
            {/* Soft Background Glow */}
            <div
              ref={heroGlowRef}
              className="absolute -inset-4 rounded-3xl bg-amber-400/12 blur-2xl pointer-events-none"
            />

            {/* Entrance + Perspective + Float Layered Showcase */}
            <div ref={heroShowcaseEntranceRef} className="will-change-transform">
              <div ref={heroParallaxRef} className="will-change-transform">
                <div ref={heroFloatRef}>
                  <div className="relative rounded-2xl p-2 sm:p-3 bg-white/80 backdrop-blur-xs border border-stone-200/80 shadow-[0_25px_60px_-20px_rgba(15,23,42,0.22)] hover:shadow-[0_32px_72px_-18px_rgba(217,119,6,0.18)] transition-shadow duration-500">
                    <img
                      src={HERO_IMAGE}
                      alt="PrepInt WorkSpace Preview"
                      className="block w-full h-auto rounded-xl object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <div
        ref={featuresSectionRef}
        id="features"
        className="w-full mt-16 sm:mt-24 pb-24 scroll-mt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mt-8">
            <div
              ref={featuresHeaderRef}
              className="text-center max-w-xl mx-auto mb-14"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Why Choose PrepInt
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
                Features That Make You Shine
              </h2>
              <p className="text-sm text-slate-500">
                Crafted to bridge the gap between building software and
                interviewing confidently.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 sm:gap-8">
              {/* First three cards */}
              <div className="feature-grid-row grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {APP_FEATURES.slice(0, 3).map((features) => (
                  <div
                    key={features.id}
                    className="feature-card bg-white p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-amber-500/8 transition-[border-color,box-shadow] duration-300 border border-stone-200/80 hover:border-amber-300 flex flex-col justify-between group"
                  >
                    <div>
                      <span className="feature-badge text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md inline-block mb-3 will-change-transform">
                        {features.id}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2.5 group-hover:text-amber-600 transition-colors">
                        {features.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {features.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Remaining two cards */}
              <div className="feature-grid-row grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {APP_FEATURES.slice(3).map((features) => (
                  <div
                    key={features.id}
                    className="feature-card bg-white p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-amber-500/8 transition-[border-color,box-shadow] duration-300 border border-stone-200/80 hover:border-amber-300 flex flex-col justify-between group"
                  >
                    <div>
                      <span className="feature-badge text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md inline-block mb-3 will-change-transform">
                        {features.id}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2.5 group-hover:text-amber-600 transition-colors">
                        {features.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {features.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="text-xs text-slate-500 text-center py-8 border-t border-stone-200/80 bg-white/70 backdrop-blur-xs"
      >
        <p>Made with 🧡 by developers, for developers • Happy Coding</p>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
