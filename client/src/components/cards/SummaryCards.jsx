import {
  LuTrash2,
  LuClock,
  LuBookOpen,
  LuBriefcase,
  LuArrowRight,
} from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCards = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  const totalQuestions = Number(questions) || 0;
  const totalYears = Number(experience) || 0;

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
      className="session-card h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/85 bg-white shadow-2xs hover:shadow-xl hover:shadow-amber-500/8 hover:border-amber-300 transition-[border-color,box-shadow] duration-300 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
      onClick={onSelect}
    >
      <div>
        {/* Top Header Card Background */}
        <div
          className="relative p-5 border-b border-stone-100"
          style={{
            background:
              colors?.bgcolor ||
              "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
          }}
        >
          {/* Delete Button */}
          <button
            type="button"
            className="session-delete-btn absolute right-3.5 top-3.5 h-8 w-8 rounded-lg bg-white/90 text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200/60 shadow-2xs transition-[color,background-color,border-color,transform] duration-200 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onKeyDown={(e) => e.stopPropagation()}
            title="Delete session"
            aria-label="Delete session"
          >
            <LuTrash2 className="text-sm" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <div className="session-card-badge flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-stone-200/70 text-sm font-bold text-slate-800 shadow-2xs will-change-transform">
              {getInitials(role)}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {role || "Untitled Role"}
              </h2>
              <p className="mt-0.5 truncate text-xs text-slate-500 font-medium">
                {topicsToFocus || "General Technical Topics"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5">
          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
              <LuBriefcase className="text-stone-400 text-xs" />
              {totalYears} {totalYears === 1 ? "Year" : "Years"} exp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/70 bg-amber-50/70 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
              <LuBookOpen className="text-amber-600 text-xs" />
              {totalQuestions} Q&A
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              <LuClock className="text-stone-400 text-xs" />
              {lastUpdated || "Recently"}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {description ||
              "Personalized AI curated interview preparation session with instant breakdown and tips."}
          </p>
        </div>
      </div>

      {/* Footer Action Strip */}
      <div className="px-5 py-3.5 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-amber-600 transition-colors">
        <span>Practice Interview</span>
        <LuArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </div>
  );
};

export default SummaryCards;
