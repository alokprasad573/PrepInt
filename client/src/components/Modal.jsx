import { useEffect, useId, useRef, useState } from "react";
import {
  gsap,
  MOTION_TOKENS,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "../animations";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  const [prevIsOpen, setPrevIsOpen] = useState(Boolean(isOpen));
  const [isClosing, setIsClosing] = useState(false);
  const titleId = useId();
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const mouseDownTargetRef = useRef(null);
  const activeTlRef = useRef(null);

  if (Boolean(isOpen) !== prevIsOpen) {
    setPrevIsOpen(Boolean(isOpen));
    if (!isOpen && !prefersReducedMotion()) {
      setIsClosing(true);
    } else {
      setIsClosing(false);
    }
  }

  const shouldRender = Boolean(isOpen) || isClosing;

  // Escape key & body scroll lock while modal is rendered
  useEffect(() => {
    if (!shouldRender) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRender, isOpen, onClose]);

  useIsomorphicLayoutEffect(() => {
    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    if (!shouldRender || !backdrop || !dialog) return undefined;

    activeTlRef.current?.kill();
    const reduced = prefersReducedMotion();

    if (isOpen) {
      if (reduced) {
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(dialog, { opacity: 1, scale: 1, y: 0, clearProps: "transform" });
        return undefined;
      }

      const tl = gsap.timeline();
      activeTlRef.current = tl;

      tl.fromTo(
        backdrop,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.24,
          ease: MOTION_TOKENS.ease.smooth,
        },
        0,
      ).fromTo(
        dialog,
        { opacity: 0, scale: 0.94, y: 18 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.36,
          ease: MOTION_TOKENS.ease.cinematic,
          clearProps: "transform",
        },
        0.03,
      );

      return () => {
        tl.kill();
      };
    }

    if (reduced) {
      return undefined;
    }

    const exitTl = gsap.timeline({
      onComplete: () => {
        setIsClosing(false);
      },
    });
    activeTlRef.current = exitTl;

    exitTl
      .to(
        dialog,
        {
          opacity: 0,
          scale: 0.95,
          y: 12,
          duration: 0.2,
          ease: "power2.in",
        },
        0,
      )
      .to(
        backdrop,
        {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
        },
        0.02,
      );

    return () => {
      exitTl.kill();
    };
  }, [isOpen, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={backdropRef}
      onMouseDown={(e) => {
        mouseDownTargetRef.current = e.target;
      }}
      onClick={(e) => {
        if (
          e.target === backdropRef.current &&
          mouseDownTargetRef.current === backdropRef.current
        ) {
          onClose?.();
        }
      }}
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-slate-950/60 backdrop-blur-xs p-4"
    >
      {/* Modal Content */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={!hideHeader && title ? titleId : undefined}
        className="relative flex flex-col bg-white shadow-2xl rounded-2xl sm:rounded-3xl border border-stone-200/90 overflow-hidden max-h-[92vh] will-change-transform"
      >
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 id={titleId} className="md:text-lg font-medium text-gray-900">
              {title}
            </h3>
          </div>
        )}

        <button
          type="button"
          aria-label="Close modal"
          className="text-stone-400 bg-stone-100 hover:bg-stone-200 hover:text-slate-800 rounded-full w-8 h-8 flex justify-center items-center absolute top-4 right-4 z-10 transition-[background-color,color,transform] duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
          onClick={onClose}
        >
          <svg
            className="w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        {/* Modal Body Scrollable */}
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
