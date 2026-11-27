import {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from "react";
import moment from "moment";
import {
  LuPlus,
  LuSearch,
  LuLayers,
  LuSparkles,
  LuBookOpen,
} from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import { toast } from "react-hot-toast";
import WorkSpaceLayout from "../../components/layouts/WorkspaceLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import SummaryCards from "../../components/cards/SummaryCards";
import Modal from "../../components/Modal";
import CreateSessionForms from "./CreateSessionForms";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  useIsomorphicLayoutEffect,
  attachHoverLift,
  attachPressFeedback,
} from "../../animations";

const WorkSpace = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAuthenticated = Boolean(user);

  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const newSessionBtnRef = useRef(null);
  const newSessionIconRef = useRef(null);
  const statsGridRef = useRef(null);
  const searchWrapRef = useRef(null);
  const sessionsGridRef = useRef(null);
  const emptyStateRef = useRef(null);
  const searchEmptyRef = useRef(null);

  const hasAnimatedSearchBarRef = useRef(false);
  const hasAnimatedInitialGridRef = useRef(false);

  // Fetching all sessions
  const fetchAllSessions = useCallback(async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data || []);
    } catch (error) {
      console.error("Error fetching session data: ", error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
        if (isMounted) {
          setSessions(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching session data: ", error);
      } finally {
        if (isMounted) {
          setIsLoadingSessions(false);
        }
      }
    };

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("Session Deleted Successfully.");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });

      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
    }
  };

  // Filter sessions by search term
  const filteredSessions = useMemo(() => {
    if (!searchTerm.trim()) return sessions;
    const term = searchTerm.toLowerCase();
    return sessions.filter(
      (s) =>
        s?.role?.toLowerCase().includes(term) ||
        s?.topicsToFocus?.toLowerCase().includes(term) ||
        s?.description?.toLowerCase().includes(term),
    );
  }, [sessions, searchTerm]);

  // Quick stats calculation
  const totalQuestionsPracticed = useMemo(() => {
    return sessions.reduce((acc, curr) => {
      return acc + (Array.isArray(curr?.questions) ? curr.questions.length : 0);
    }, 0);
  }, [sessions]);

  // 1. Initial Dashboard Chrome Entrance (Heading, New Session CTA, Stats Grid)
  useIsomorphicLayoutEffect(() => {
    if (!isAuthenticated || !containerRef.current) return undefined;

    const mm = gsap.matchMedia(containerRef.current);

    mm.add(
      {
        isMobile: MOTION_MEDIA.mobile,
        motionAllowed: MOTION_MEDIA.motionAllowed,
        isFinePointer: "(hover: hover) and (pointer: fine)",
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        const { isMobile, isFinePointer, reduced } = context.conditions;
        const statCards = gsap.utils.toArray(".stat-card", statsGridRef.current);
        const headingItems = headingRef.current
          ? Array.from(headingRef.current.children)
          : [];

        if (reduced) {
          gsap.set(
            [...headingItems, newSessionBtnRef.current, ...statCards].filter(
              Boolean,
            ),
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clearProps: "transform",
            },
          );
          return undefined;
        }

        const cleanups = [];
        const tl = gsap.timeline({
          defaults: { ease: MOTION_TOKENS.ease.out },
        });

        tl.fromTo(
          headingItems,
          { y: isMobile ? 12 : 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.06,
            clearProps: "transform",
          },
          0.02,
        )
          .fromTo(
            newSessionBtnRef.current,
            { scale: 0.92, opacity: 0, y: 8 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: MOTION_TOKENS.ease.cinematic,
              clearProps: "transform",
            },
            0.1,
          )
          .fromTo(
            statCards,
            { y: isMobile ? 14 : 20, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.08,
              clearProps: "transform",
            },
            0.16,
          );

        if (isFinePointer) {
          cleanups.push(
            attachHoverLift(statCards, {
              y: -3,
              scale: 1.008,
              duration: 0.24,
              badgeSelector: ".stat-icon",
            }),
          );

          const btn = newSessionBtnRef.current;
          const icon = newSessionIconRef.current;
          if (btn && icon) {
            const onEnter = () => {
              gsap.to(icon, {
                rotation: 90,
                duration: 0.28,
                ease: MOTION_TOKENS.ease.out,
                overwrite: "auto",
              });
            };
            const onLeave = () => {
              gsap.to(icon, {
                rotation: 0,
                duration: 0.25,
                ease: MOTION_TOKENS.ease.out,
                overwrite: "auto",
              });
            };
            btn.addEventListener("mouseenter", onEnter);
            btn.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              btn.removeEventListener("mouseenter", onEnter);
              btn.removeEventListener("mouseleave", onLeave);
              gsap.killTweensOf(icon);
            });
          }
        }

        cleanups.push(attachPressFeedback(newSessionBtnRef.current));

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, [isAuthenticated]);

  // 2. Search Bar Fade-In once sessions exist
  useIsomorphicLayoutEffect(() => {
    if (!isAuthenticated || sessions.length === 0 || !searchWrapRef.current) {
      return undefined;
    }
    if (hasAnimatedSearchBarRef.current) return undefined;

    hasAnimatedSearchBarRef.current = true;
    const mm = gsap.matchMedia(searchWrapRef.current);

    mm.add(
      {
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        if (context.conditions.reduced) {
          gsap.set(searchWrapRef.current, { opacity: 1, y: 0 });
          return undefined;
        }

        gsap.fromTo(
          searchWrapRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            ease: MOTION_TOKENS.ease.out,
            clearProps: "transform",
          },
        );
        return undefined;
      },
    );

    return () => mm.revert();
  }, [isAuthenticated, sessions.length]);

  // 3. Session Cards Cascade Stagger + Hover Lift (non-blocking during search)
  useIsomorphicLayoutEffect(() => {
    if (!isAuthenticated || isLoadingSessions || !containerRef.current) {
      return undefined;
    }

    const mm = gsap.matchMedia(containerRef.current);

    mm.add(
      {
        isMobile: MOTION_MEDIA.mobile,
        motionAllowed: MOTION_MEDIA.motionAllowed,
        isFinePointer: "(hover: hover) and (pointer: fine)",
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        const { isMobile, isFinePointer, reduced } = context.conditions;

        if (filteredSessions.length > 0 && sessionsGridRef.current) {
          const cards = gsap.utils.toArray(
            ".session-card",
            sessionsGridRef.current,
          );

          if (!hasAnimatedInitialGridRef.current) {
            hasAnimatedInitialGridRef.current = true;
            if (reduced) {
              gsap.set(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
                clearProps: "transform",
              });
            } else {
              gsap.fromTo(
                cards,
                {
                  opacity: 0,
                  y: isMobile ? 16 : 24,
                  scale: 0.96,
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: isMobile ? 0.42 : 0.54,
                  stagger: isMobile ? 0.045 : 0.065,
                  ease: MOTION_TOKENS.ease.out,
                  clearProps: "transform,opacity",
                },
              );
            }
          }

          if (isFinePointer && !reduced) {
            return attachHoverLift(cards, {
              y: -5,
              scale: 1.01,
              duration: 0.26,
              badgeSelector: ".session-card-badge",
            });
          }
          return undefined;
        }

        if (sessions.length === 0 && emptyStateRef.current) {
          if (reduced) {
            gsap.set(emptyStateRef.current, { opacity: 1, y: 0, scale: 1 });
            return undefined;
          }

          gsap.fromTo(
            emptyStateRef.current,
            { opacity: 0, y: 22, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.56,
              ease: MOTION_TOKENS.ease.cinematic,
              clearProps: "transform",
            },
          );
          return undefined;
        }

        if (searchEmptyRef.current && !reduced) {
          gsap.fromTo(
            searchEmptyRef.current,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.28,
              ease: MOTION_TOKENS.ease.out,
              clearProps: "transform",
            },
          );
        }

        return undefined;
      },
    );

    return () => mm.revert();
  }, [
    isAuthenticated,
    isLoadingSessions,
    filteredSessions.length,
    sessions.length,
  ]);

  return (
    <WorkSpaceLayout>
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12"
      >
        {/* Header Title & Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div ref={headingRef}>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Interview Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select an ongoing preparation track or create a new AI-targeted
              session.
            </p>
          </div>

          <button
            ref={newSessionBtnRef}
            type="button"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-sm font-semibold text-white px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition-[background-color,box-shadow] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            onClick={() => setOpenCreateModal(true)}
          >
            <span ref={newSessionIconRef} className="inline-flex">
              <LuPlus className="text-lg" />
            </span>
            <span>New Session</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div
          ref={statsGridRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6"
        >
          <div className="stat-card bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-amber-200/90 shadow-2xs hover:shadow-md hover:shadow-amber-500/5 transition-[border-color,box-shadow] duration-200 flex items-center gap-3.5">
            <div className="stat-icon w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <LuLayers className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Total Sessions
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {sessions.length}
              </h3>
            </div>
          </div>

          <div className="stat-card bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-200/90 shadow-2xs hover:shadow-md hover:shadow-emerald-500/5 transition-[border-color,box-shadow] duration-200 flex items-center gap-3.5">
            <div className="stat-icon w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <LuBookOpen className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Questions Mastered
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {totalQuestionsPracticed}
              </h3>
            </div>
          </div>

          <div className="stat-card bg-white p-4 rounded-2xl border border-stone-200/80 hover:border-amber-200/90 shadow-2xs hover:shadow-md hover:shadow-amber-500/5 transition-[border-color,box-shadow] duration-200 flex items-center gap-3.5">
            <div className="stat-icon w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <LuSparkles className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">AI Engine</p>
              <h3 className="text-lg font-bold text-slate-900">
                Google Gemini
              </h3>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {sessions.length > 0 && (
          <div ref={searchWrapRef} className="mb-6">
            <div
              className={`relative max-w-md transition-transform duration-200 ${
                isSearchFocused ? "scale-[1.01]" : "scale-100"
              }`}
            >
              <LuSearch
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-base transition-colors duration-200 ${
                  isSearchFocused ? "text-amber-500" : "text-stone-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search roles or focus topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200/80 rounded-xl text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-[border-color,box-shadow] duration-200 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* Sessions Grid */}
        {isLoadingSessions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-56 rounded-2xl border border-stone-200/70 bg-white p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-stone-200/80" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-stone-200/80" />
                    <div className="h-3 w-1/2 rounded bg-stone-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-stone-100" />
                  <div className="h-3 w-4/5 rounded bg-stone-100" />
                </div>
                <div className="h-4 w-1/3 rounded bg-stone-100" />
              </div>
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div
            ref={sessionsGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {filteredSessions.map((data, index) => (
              <SummaryCards
                key={data._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || ""}
                questions={
                  Array.isArray(data?.questions) ? data.questions.length : 0
                }
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("Do MMM YYYY")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          /* Empty State */
          <div
            ref={emptyStateRef}
            className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs mt-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mx-auto mb-4">
              <LuSparkles className="text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              No interview sessions yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              Start practicing with targeted AI-curated questions tailored to
              your dream job designation and experience.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-linear-to-r hover:from-amber-500 hover:to-orange-600 text-sm font-semibold text-white px-6 py-2.5 rounded-xl shadow-md transition-[background-color,box-shadow,transform] duration-200 cursor-pointer active:scale-[0.98]"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="text-lg" />
              <span>Create Your First Session</span>
            </button>
          </div>
        ) : (
          /* Search Not Found State */
          <div
            ref={searchEmptyRef}
            className="bg-white rounded-2xl border border-stone-200/80 p-8 text-center max-w-md mx-auto"
          >
            <p className="text-sm font-semibold text-slate-700">
              No sessions match "{searchTerm}"
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching with a different keyword or clear search.
            </p>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div>
          <CreateSessionForms />
        </div>
      </Modal>

      {/* Delete Alert Modal */}
      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Session"
      >
        <div className="w-[90vw] sm:w-95">
          <DeleteAlertContent
            content="Are you sure you want to delete this session? This action cannot be undone."
            onDelete={() => deleteSession(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </WorkSpaceLayout>
  );
};

export default WorkSpace;
