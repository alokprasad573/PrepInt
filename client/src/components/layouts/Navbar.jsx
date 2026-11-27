import { useRef } from "react";
import { Link } from "react-router-dom";
import ProfileInfoCard from "../cards/ProfileInfoCard";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  useIsomorphicLayoutEffect,
} from "../../animations";

const Navbar = () => {
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const profileWrapRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia(headerRef.current);

    mm.add(
      {
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        const { reduced } = context.conditions;

        if (reduced) {
          gsap.set(
            [headerRef.current, logoRef.current, profileWrapRef.current],
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clearProps: "transform",
            },
          );
          return undefined;
        }

        const tl = gsap.timeline({
          defaults: { ease: MOTION_TOKENS.ease.out },
        });

        tl.fromTo(
          headerRef.current,
          { y: -14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            clearProps: "transform",
          },
          0,
        )
          .fromTo(
            logoRef.current,
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.42,
              ease: MOTION_TOKENS.ease.cinematic,
              clearProps: "transform",
            },
            0.08,
          )
          .fromTo(
            profileWrapRef.current,
            { y: -6, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              clearProps: "transform",
            },
            0.12,
          );

        return undefined;
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="h-16 bg-white/85 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 transition-[background-color,box-shadow] duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        <Link
          ref={logoRef}
          to="/workspace"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 rounded-xl pr-1"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center p-2 shadow-xs transition-transform duration-200 group-hover:scale-105">
            <img
              src="/prepInt.svg"
              alt="PrepInt"
              className="w-full h-full filter invert brightness-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Prep<span className="text-amber-500">Int</span>
            </span>
          </div>
        </Link>

        <div ref={profileWrapRef}>
          <ProfileInfoCard />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
