import { useRef, useState } from "react";
import { LuChevronDown, LuPinOff, LuPin, LuSparkles } from "react-icons/lu";
import AiResponsePreview from "./AiResponsePreview";
import SpinnerLoader from "../../../components/loader/SpinnerLoader";
import {
  gsap,
  MOTION_TOKENS,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "../../../animations";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
  isActive = false,
  isExplainLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardRef = useRef(null);
  const collapseWrapRef = useRef(null);
  const innerContentRef = useRef(null);
  const chevronRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const wrap = collapseWrapRef.current;
    const inner = innerContentRef.current;
    const chevron = chevronRef.current;
    if (!wrap || !inner) return undefined;

    const reduced = prefersReducedMotion();

    // Initialize collapsed state synchronously before paint without animating
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (!isExpanded) {
        gsap.set(wrap, { height: 0, opacity: 0, display: "none" });
        if (chevron) gsap.set(chevron, { rotation: 0 });
      } else {
        gsap.set(wrap, { height: "auto", opacity: 1, display: "block" });
        if (chevron) gsap.set(chevron, { rotation: 180 });
      }
      return undefined;
    }

    gsap.killTweensOf([wrap, inner, chevron].filter(Boolean));

    if (reduced) {
      if (isExpanded) {
        gsap.set(wrap, { display: "block", height: "auto", opacity: 1 });
        gsap.set(inner, { y: 0, opacity: 1 });
        if (chevron) gsap.set(chevron, { rotation: 180 });
      } else {
        gsap.set(wrap, { display: "none", height: 0, opacity: 0 });
        if (chevron) gsap.set(chevron, { rotation: 0 });
      }
      return undefined;
    }

    if (chevron) {
      gsap.to(chevron, {
        rotation: isExpanded ? 180 : 0,
        duration: 0.28,
        ease: MOTION_TOKENS.ease.out,
        overwrite: "auto",
      });
    }

    if (isExpanded) {
      gsap.set(wrap, { display: "block", height: "auto" });
      const targetHeight = wrap.scrollHeight;
      gsap.set(wrap, { height: 0, opacity: 0 });
      gsap.set(inner, { y: -6, opacity: 0 });

      const tl = gsap.timeline();
      tl.to(wrap, {
        height: targetHeight,
        opacity: 1,
        duration: 0.34,
        ease: MOTION_TOKENS.ease.out,
      })
        .to(
          inner,
          {
            y: 0,
            opacity: 1,
            duration: 0.28,
            ease: MOTION_TOKENS.ease.out,
            clearProps: "transform",
          },
          0.05,
        )
        .add(() => {
          gsap.set(wrap, { height: "auto" });
          cardRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        });

      return () => tl.kill();
    }

    const currentHeight = wrap.offsetHeight;
    gsap.set(wrap, { height: currentHeight });

    const tl = gsap.timeline();
    tl.to(inner, {
      y: -4,
      opacity: 0,
      duration: 0.16,
      ease: MOTION_TOKENS.ease.inOut,
    }).to(
      wrap,
      {
        height: 0,
        opacity: 0,
        duration: 0.24,
        ease: MOTION_TOKENS.ease.inOut,
        onComplete: () => {
          gsap.set(wrap, { display: "none" });
        },
      },
      0.04,
    );

    return () => tl.kill();
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      ref={cardRef}
      className={`question-card group bg-white rounded-2xl mb-4 overflow-hidden py-4 px-5 border transition-[border-color,box-shadow] duration-200 ${
        isActive
          ? "border-amber-300 ring-2 ring-amber-500/15 shadow-lg shadow-amber-500/10"
          : "border-stone-200/80 hover:border-amber-200/90 shadow-sm shadow-slate-900/5 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={toggleExpand}
          aria-expanded={isExpanded}
          className="flex items-start gap-3.5 text-left flex-1 min-w-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-lg"
        >
          <span className="text-xs md:text-[15px] font-bold text-amber-500 leading-5 shrink-0">
            Q
          </span>
          <h3 className="text-xs md:text-[14px] font-semibold text-slate-800 leading-5 mr-0 md:mr-8 group-hover:text-slate-950 transition-colors">
            {question}
          </h3>
        </button>

        <div className="flex items-center justify-end ml-2 relative shrink-0">
          <div className="relative flex items-center">
            <div
              className={`flex items-center transition-[opacity,transform] duration-200 ease-out ${
                isExpanded || isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-100 md:opacity-0 md:translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 focus-within:opacity-100 focus-within:translate-x-0"
              }`}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 mr-2 rounded-lg text-nowrap border cursor-pointer transition-[color,background-color,border-color,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
                  isPinned
                    ? "text-amber-800 bg-amber-100 border-amber-300"
                    : "text-zinc-600 bg-zinc-100 border-zinc-200 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200"
                }`}
                onClick={onTogglePin}
                aria-label={isPinned ? "Unpin question" : "Pin question"}
                title={isPinned ? "Unpin question" : "Pin question"}
              >
                {isPinned ? (
                  <LuPinOff className="text-xs text-amber-700" />
                ) : (
                  <LuPin className="text-xs" />
                )}
              </button>

              <button
                type="button"
                disabled={isExplainLoading}
                className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1.5 mr-2 rounded-lg text-nowrap border border-amber-200 hover:bg-amber-100 hover:border-amber-300 cursor-pointer transition-[color,background-color,border-color,transform] duration-150 active:scale-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                onClick={() => {
                  setIsExpanded(true);
                  onLearnMore();
                }}
              >
                {isExplainLoading ? (
                  <SpinnerLoader className="h-3.5 w-3.5 text-amber-600" />
                ) : (
                  <LuSparkles className="text-amber-600" />
                )}
                <span className="hidden md:block">
                  {isExplainLoading ? "Explaining..." : "Explain"}
                </span>
              </button>
            </div>

            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              onClick={toggleExpand}
              aria-label={isExpanded ? "Collapse answer" : "Expand answer"}
              aria-expanded={isExpanded}
            >
              <span ref={chevronRef} className="inline-flex">
                <LuChevronDown size={20} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div ref={collapseWrapRef} className="overflow-hidden">
        <div
          ref={innerContentRef}
          className="mt-4 text-slate-700 bg-stone-50/90 border border-stone-200/70 px-5 py-3.5 rounded-xl"
        >
          <AiResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
