import { useParams } from "react-router-dom";
import moment from "moment";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import WorkspaceLayout from "../../components/layouts/WorkspaceLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import QuestionCard from "./components/QuestionCard";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import AiResponsePreview from "./components/AiResponsePreview";
import SpinnerLoader from "../../components/loader/SpinnerLoader";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "../../animations";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const { user } = useContext(UserContext);
  const isAuthenticated = Boolean(user);

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // Separate loading states — session vs explanation
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isExplainLoading, setIsExplainLoading] = useState(false);

  const sectionHeaderRef = useRef(null);
  const questionsContainerRef = useRef(null);
  const animatedQuestionCountRef = useRef(0);

  // Reset animated count when navigating to another session
  useIsomorphicLayoutEffect(() => {
    animatedQuestionCountRef.current = 0;
  }, [sessionId]);

  // Fetch session details by ID
  const fetchSessionDetailsById = async () => {
    if (!sessionId) return;
    try {
      setIsPageLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE_BY_ID(sessionId),
      );
      if (response.data?.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error: ", error);
      setErrorMsg("Failed to load session details.");
    } finally {
      setIsPageLoading(false);
    }
  };

  // Generate Concept Explanation
  const generateConceptExplanation = async (questionId, question) => {
    // Toggle: clicking same question closes the drawer
    if (activeQuestionId === questionId && openLearnMoreDrawer) {
      setOpenLearnMoreDrawer(false);
      setActiveQuestionId(null);
      setExplanation(null);
      return;
    }

    try {
      setErrorMsg("");
      setExplanation(null);
      setActiveQuestionId(questionId);
      setIsExplainLoading(true); // only affects drawer — NOT the page
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question },
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation. Try again later.");
      console.error("Error:", error);
    } finally {
      setIsExplainLoading(false);
    }
  };

  // Toggle Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTIONS.PIN(questionId),
      );
      if (response.data && response.data.question) {
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  // Add more questions to a session
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);

      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        },
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTIONS.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        },
      );

      if (response.data) {
        toast.success("Added More Q&A!!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsUpdateLoader(false);
    }
  };

  const handleCloseDrawer = () => {
    setOpenLearnMoreDrawer(false);
    setActiveQuestionId(null);
    setExplanation(null);
    setErrorMsg("");
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      if (!sessionId) return;
      try {
        setIsPageLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.SESSION.GET_ONE_BY_ID(sessionId),
        );
        if (isMounted && response.data?.session) {
          setSessionData(response.data.session);
        }
      } catch (error) {
        console.error("Error: ", error);
        if (isMounted) setErrorMsg("Failed to load session details.");
      } finally {
        if (isMounted) setIsPageLoading(false);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Animate section header once mounted
  useIsomorphicLayoutEffect(() => {
    if (!isAuthenticated || !sectionHeaderRef.current) return undefined;

    const mm = gsap.matchMedia(sectionHeaderRef.current);

    mm.add(
      {
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        if (context.conditions.reduced) {
          gsap.set(sectionHeaderRef.current, { opacity: 1, y: 0 });
          return undefined;
        }

        gsap.fromTo(
          sectionHeaderRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: MOTION_TOKENS.ease.out,
            clearProps: "transform",
          },
        );
        return undefined;
      },
    );

    return () => mm.revert();
  }, [isAuthenticated]);

  // Stagger newly loaded or newly appended question cards without re-hiding existing ones
  const questionCount = sessionData?.questions?.length || 0;

  useIsomorphicLayoutEffect(() => {
    if (!isAuthenticated || !questionsContainerRef.current || questionCount === 0)
      return undefined;

    const prevCount = animatedQuestionCountRef.current;
    if (questionCount <= prevCount) return undefined;

    const allCards = gsap.utils.toArray(
      ".question-item",
      questionsContainerRef.current,
    );
    const newlyAdded = allCards.slice(prevCount);
    animatedQuestionCountRef.current = questionCount;

    if (newlyAdded.length === 0) return undefined;

    const reduced = prefersReducedMotion();
    if (reduced) {
      gsap.set(newlyAdded, { opacity: 1, y: 0, clearProps: "transform" });
      if (prevCount > 0) {
        newlyAdded[0]?.scrollIntoView({ behavior: "auto", block: "nearest" });
      }
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        newlyAdded,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.055,
          ease: MOTION_TOKENS.ease.out,
          clearProps: "transform,opacity",
        },
      );
    }, questionsContainerRef.current);

    if (prevCount > 0) {
      newlyAdded[0]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    return () => ctx.revert();
  }, [isAuthenticated, questionCount]);

  return (
    <WorkspaceLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience ?? "-"}
        questions={sessionData?.questions?.length ?? "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto px-6 sm:px-10 md:px-20 py-6">
        <div
          ref={sectionHeaderRef}
          className="flex items-center justify-between mb-5"
        >
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Interview Q&amp;A
          </h2>
        </div>

        {/* Page load skeleton — only shows on first load, never when explanation loads */}
        {isPageLoading && !sessionData ? (
          <SkeletonLoader count={5} />
        ) : (
          <div className="flex gap-4 items-start">
            {/* Questions List — shrinks when drawer is open on desktop */}
            <div
              ref={questionsContainerRef}
              className={`transition-[width,max-width] duration-300 ease-out w-full ${
                openLearnMoreDrawer ? "md:w-3/5" : "max-w-4xl"
              }`}
            >
              {sessionData?.questions?.map((data, index) => (
                <div key={data._id || index} className="question-item mb-4">
                  <QuestionCard
                    question={data?.question}
                    answer={data?.answer}
                    onLearnMore={() =>
                      generateConceptExplanation(data._id, data.question)
                    }
                    isPinned={data?.isPinned}
                    onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    isActive={activeQuestionId === data._id}
                    isExplainLoading={
                      isExplainLoading && activeQuestionId === data._id
                    }
                  />

                  {!isPageLoading &&
                    sessionData?.questions?.length == index + 1 && (
                      <div className="flex items-center justify-center mt-6">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2.5 text-sm text-white font-semibold bg-slate-900 hover:bg-linear-to-r hover:from-amber-500 hover:to-orange-600 px-6 py-2.5 rounded-xl text-nowrap cursor-pointer shadow-md transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isPageLoading || isUpdateLoader}
                          onClick={uploadMoreQuestions}
                        >
                          {isUpdateLoader ? (
                            <SpinnerLoader className="h-4 w-4 text-white" />
                          ) : (
                            <LuListCollapse className="text-lg" />
                          )}
                          <span>
                            {isUpdateLoader ? "Generating..." : "Load More..."}
                          </span>
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={handleCloseDrawer}
          title={explanation?.title || ""}
        >
          {/* Error inside drawer */}
          {errorMsg && (
            <p className="flex items-start gap-2 text-sm text-amber-600 font-medium mb-4">
              <LuCircleAlert className="mt-0.5 shrink-0" /> {errorMsg}
            </p>
          )}

          {/* Skeleton only when explanation is loading */}
          {isExplainLoading && <SkeletonLoader count={2} />}

          {/* Explanation shows when NOT loading AND data exists */}
          {!isExplainLoading && explanation && (
            <AiResponsePreview content={explanation?.explanation} />
          )}
        </Drawer>
      </div>
    </WorkspaceLayout>
  );
};

export default InterviewPrep;
