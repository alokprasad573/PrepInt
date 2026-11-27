import { useRef } from "react";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  useIsomorphicLayoutEffect,
} from "../../../animations";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  lastUpdated,
}) => {
  const totalYears = Number(experience) || 0;
  const headerRef = useRef(null);
  const titleBlockRef = useRef(null);
  const pillsRef = useRef(null);
  const blobsRef = useRef(null);
  const hasAnimatedContentRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (!role || !headerRef.current || hasAnimatedContentRef.current) {
      return undefined;
    }
    hasAnimatedContentRef.current = true;

    const mm = gsap.matchMedia(headerRef.current);

    mm.add(
      {
        isDesktop: MOTION_MEDIA.desktop,
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        const { isDesktop, reduced } = context.conditions;
        const titleItems = titleBlockRef.current
          ? Array.from(titleBlockRef.current.children)
          : [];
        const pills = pillsRef.current
          ? Array.from(pillsRef.current.children)
          : [];
        const blobs = gsap.utils.toArray(".role-glow-blob", blobsRef.current);

        if (reduced) {
          gsap.set([...titleItems, ...pills], {
            opacity: 1,
            y: 0,
            scale: 1,
            clearProps: "transform",
          });
          return undefined;
        }

        const tl = gsap.timeline({
          defaults: { ease: MOTION_TOKENS.ease.out },
        });

        tl.fromTo(
          titleItems,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            clearProps: "transform",
          },
          0,
        ).fromTo(
          pills,
          { opacity: 0, y: 10, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            stagger: 0.055,
            ease: MOTION_TOKENS.ease.cinematic,
            clearProps: "transform",
          },
          0.14,
        );

        if (isDesktop && blobs.length > 0) {
          blobs.forEach((blob, idx) => {
            gsap.to(blob, {
              x: idx % 2 === 0 ? 12 : -10,
              y: idx % 2 === 0 ? -8 : 10,
              scale: 1.08,
              duration: 5 + idx * 1.1,
              repeat: -1,
              yoyo: true,
              ease: MOTION_TOKENS.ease.breath,
            });
          });
        }

        return undefined;
      },
    );

    return () => mm.revert();
  }, [role]);

  return (
    <div
      ref={headerRef}
      className="bg-white relative border-b border-stone-200/80 overflow-hidden"
    >
      <div className="container mx-auto px-6 sm:px-10 md:px-20">
        <div className="min-h-44 py-7 flex flex-col justify-center relative z-10">
          <div className="flex items-start">
            <div className="grow">
              {role ? (
                <div ref={titleBlockRef}>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {role}
                  </h2>
                  <p className="text-sm font-medium text-slate-600 mt-1.5">
                    {topicsToFocus}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 animate-pulse">
                  <div className="h-7 w-56 rounded-lg bg-stone-200/80" />
                  <div className="h-4 w-72 rounded-md bg-stone-100" />
                </div>
              )}
            </div>
          </div>

          <div
            ref={pillsRef}
            className="flex flex-wrap items-center gap-2.5 mt-4"
          >
            <div className="text-[11px] font-semibold text-white bg-slate-900 px-3 py-1 rounded-full shadow-2xs">
              Experience: {totalYears} {totalYears == 1 ? "Year" : "Years"}
            </div>

            <div className="text-[11px] font-semibold text-amber-900 bg-amber-100/90 border border-amber-200 px-3 py-1 rounded-full">
              {questions} Q&amp;A
            </div>

            {lastUpdated && (
              <div className="text-[11px] font-semibold text-slate-700 bg-stone-100 border border-stone-200/80 px-3 py-1 rounded-full">
                Last Updated: {lastUpdated}
              </div>
            )}
          </div>
        </div>

        <div
          ref={blobsRef}
          className="w-[45vw] md:w-[30vw] h-full flex items-center justify-center bg-transparent overflow-hidden absolute top-0 right-0 pointer-events-none opacity-75"
        >
          <div className="role-glow-blob w-24 h-24 bg-amber-400/35 blur-[60px] rounded-full" />
          <div className="role-glow-blob w-24 h-24 bg-orange-500/25 blur-[60px] rounded-full" />
          <div className="role-glow-blob w-20 h-20 bg-rose-400/20 blur-[50px] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
