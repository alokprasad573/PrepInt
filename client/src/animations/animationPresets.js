import { gsap, MOTION_TOKENS, prefersReducedMotion } from "./gsapConfig";

/**
 * Animates elements upward into place with opacity and optional stagger.
 */
export function revealUp(
  targets,
  {
    y = 20,
    scale = 1,
    duration = MOTION_TOKENS.duration.base,
    delay = 0,
    stagger = 0,
    ease = MOTION_TOKENS.ease.out,
    clearProps = "transform,opacity",
  } = {},
) {
  const elements = gsap.utils.toArray(targets).filter(Boolean);
  if (elements.length === 0) return null;

  if (prefersReducedMotion()) {
    return gsap.set(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps,
    });
  }

  return gsap.fromTo(
    elements,
    { opacity: 0, y, scale },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger,
      ease,
      clearProps,
    },
  );
}

/**
 * Creates a ScrollTrigger-driven staggered reveal for card grids.
 */
export function scrollRevealCards(
  trigger,
  targets,
  {
    y = 32,
    scale = 0.96,
    duration = MOTION_TOKENS.duration.editorial,
    stagger = MOTION_TOKENS.stagger.cards,
    ease = MOTION_TOKENS.ease.out,
    start = "top 84%",
  } = {},
) {
  const elements = gsap.utils.toArray(targets).filter(Boolean);
  if (!trigger || elements.length === 0) return null;

  if (prefersReducedMotion()) {
    return gsap.set(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: "transform,opacity",
    });
  }

  return gsap.fromTo(
    elements,
    { opacity: 0, y, scale },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      ease,
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger,
        start,
        once: true,
      },
    },
  );
}

/**
 * Attaches GSAP hover lift and optional badge emphasis on fine-pointer devices.
 * Returns a teardown function that detaches all listeners and resets transforms.
 */
export function attachHoverLift(
  targets,
  {
    y = -5,
    scale = 1.01,
    duration = MOTION_TOKENS.duration.quick,
    badgeSelector = null,
  } = {},
) {
  if (typeof window === "undefined") return () => {};

  const canHover =
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches &&
    !prefersReducedMotion();

  if (!canHover) return () => {};

  const elements = gsap.utils.toArray(targets).filter(Boolean);
  const teardowns = [];

  elements.forEach((el) => {
    const badge = badgeSelector ? el.querySelector(badgeSelector) : null;

    const handleEnter = () => {
      gsap.to(el, {
        y,
        scale,
        duration,
        ease: MOTION_TOKENS.ease.out,
        overwrite: "auto",
      });

      if (badge) {
        gsap.to(badge, {
          scale: 1.06,
          y: -1,
          duration: MOTION_TOKENS.duration.micro,
          ease: MOTION_TOKENS.ease.out,
          overwrite: "auto",
        });
      }
    };

    const handleLeave = () => {
      gsap.to(el, {
        y: 0,
        scale: 1,
        duration: MOTION_TOKENS.duration.base * 0.65,
        ease: MOTION_TOKENS.ease.out,
        overwrite: "auto",
      });

      if (badge) {
        gsap.to(badge, {
          scale: 1,
          y: 0,
          duration: MOTION_TOKENS.duration.quick,
          ease: MOTION_TOKENS.ease.out,
          overwrite: "auto",
        });
      }
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    teardowns.push(() => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      gsap.killTweensOf(el);
      if (badge) gsap.killTweensOf(badge);
    });
  });

  return () => {
    teardowns.forEach((fn) => fn());
  };
}

/**
 * Attaches subtle pointer press scale feedback for action buttons.
 * Returns a cleanup callback to remove listeners.
 */
export function attachPressFeedback(targets, { scaleDown = 0.975 } = {}) {
  if (typeof window === "undefined" || prefersReducedMotion()) return () => {};

  const elements = gsap.utils.toArray(targets).filter(Boolean);
  const teardowns = [];

  elements.forEach((el) => {
    const down = () => {
      if (el.disabled) return;
      gsap.to(el, {
        scale: scaleDown,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const up = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    el.addEventListener("pointercancel", up);

    teardowns.push(() => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
      el.removeEventListener("pointercancel", up);
      gsap.killTweensOf(el);
    });
  });

  return () => {
    teardowns.forEach((fn) => fn());
  };
}
