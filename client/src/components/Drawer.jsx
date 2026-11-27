import { useEffect, useRef, useState } from "react";
import { LuX } from "react-icons/lu";
import {
  gsap,
  MOTION_TOKENS,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "../animations";

const Drawer = ({ isOpen, onClose, title, children }) => {
  const [prevIsOpen, setPrevIsOpen] = useState(Boolean(isOpen));
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef(null);

  if (Boolean(isOpen) !== prevIsOpen) {
    setPrevIsOpen(Boolean(isOpen));
    if (!isOpen && !prefersReducedMotion()) {
      setIsClosing(true);
    } else {
      setIsClosing(false);
    }
  }

  const shouldRender = Boolean(isOpen) || isClosing;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useIsomorphicLayoutEffect(() => {
    const el = drawerRef.current;
    if (!shouldRender || !el) return undefined;

    const reduced = prefersReducedMotion();
    gsap.killTweensOf(el);

    if (isOpen) {
      el.scrollTop = 0;

      if (reduced) {
        gsap.set(el, { xPercent: 0, opacity: 1 });
        return undefined;
      }

      const tween = gsap.fromTo(
        el,
        { xPercent: 100, opacity: 0.7 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.36,
          ease: MOTION_TOKENS.ease.cinematic,
          clearProps: "transform",
        },
      );

      return () => tween.kill();
    }

    if (reduced) {
      return undefined;
    }

    const tween = gsap.to(el, {
      xPercent: 100,
      opacity: 0.7,
      duration: 0.25,
      ease: MOTION_TOKENS.ease.inOut,
      onComplete: () => setIsClosing(false),
    });

    return () => tween.kill();
  }, [isOpen, shouldRender]);

  // Reset scroll to top when switching explanation topic while drawer stays open
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.scrollTop = 0;
    }
  }, [isOpen, title]);

  if (!shouldRender) {
    return null;
  }

  return (
    <aside
      ref={drawerRef}
      className="fixed top-16 right-0 z-40 h-[calc(100dvh-64px)] p-5 sm:p-6 overflow-y-auto custom-scrollbar bg-white w-full md:w-[40vw] shadow-2xl shadow-slate-900/10 border-l border-stone-200/90"
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5 pb-3 border-b border-stone-100">
        <h5
          id="drawer-right-label"
          className="flex items-center text-base font-bold text-slate-900 leading-snug"
        >
          {title || "Concept Explanation"}
        </h5>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close explanation drawer"
          className="text-slate-400 bg-stone-100/80 hover:bg-stone-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
        >
          <LuX className="text-lg" />
        </button>
      </div>

      {/* Body Content */}
      <div className="text-sm mb-6">{children}</div>
    </aside>
  );
};

export default Drawer;
