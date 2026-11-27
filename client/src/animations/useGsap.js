import { useEffect, useLayoutEffect, useState } from "react";
import { gsap, prefersReducedMotion } from "./gsapConfig";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Subscribes to the system `prefers-reduced-motion` media query.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduced(mediaQuery.matches);

    updatePreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return reduced;
}

/**
 * Runs a scoped `gsap.context` inside layout effect and cleanly reverts on unmount.
 */
export function useGsapContext(callback, deps = [], scopeRef = undefined) {
  useIsomorphicLayoutEffect(() => {
    if (scopeRef && !scopeRef.current) return undefined;

    let extraCleanup;
    const ctx = gsap.context((self) => {
      const result = callback(self);
      if (typeof result === "function") {
        extraCleanup = result;
      }
    }, scopeRef?.current || undefined);

    return () => {
      if (typeof extraCleanup === "function") {
        extraCleanup();
      }
      ctx.revert();
    };
  }, deps);
}

/**
 * Runs a scoped `gsap.matchMedia` inside layout effect and reverts on cleanup.
 */
export function useGsapMatchMedia(callback, deps = [], scopeRef = undefined) {
  useIsomorphicLayoutEffect(() => {
    if (scopeRef && !scopeRef.current) return undefined;

    let extraCleanup;
    const mm = gsap.matchMedia(scopeRef?.current || undefined);
    const result = callback(mm);
    if (typeof result === "function") {
      extraCleanup = result;
    }

    return () => {
      if (typeof extraCleanup === "function") {
        extraCleanup();
      }
      mm.revert();
    };
  }, deps);
}
