import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isRegistered = false;

/**
 * Registers GSAP plugins once and applies baseline ScrollTrigger configuration.
 */
export function registerGsapPlugins() {
  if (typeof window === "undefined" || isRegistered) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    ease: "power3.out",
    duration: 0.6,
  });

  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

  isRegistered = true;
}

registerGsapPlugins();

export const MOTION_TOKENS = {
  duration: {
    instant: 0,
    micro: 0.18,
    quick: 0.28,
    base: 0.5,
    editorial: 0.72,
    hero: 0.92,
    ambient: 5.5,
  },
  ease: {
    out: "power3.out",
    cinematic: "expo.out",
    text: "power4.out",
    smooth: "power2.out",
    inOut: "power2.inOut",
    breath: "sine.inOut",
  },
  stagger: {
    tight: 0.045,
    base: 0.075,
    cards: 0.095,
    hero: 0.11,
  },
};

export const MOTION_MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  tablet:
    "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  motionAllowed: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  finePointer:
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
};

/**
 * Returns true when the user has enabled reduced-motion preferences.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
