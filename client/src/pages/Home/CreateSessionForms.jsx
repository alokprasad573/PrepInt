import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import SpinnerLoader from "../../components/loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  useIsomorphicLayoutEffect,
} from "../../animations";

const CreateSessionForms = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    description: "",
    topicsToFocus: "",
    numberOfQuestions: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formContainerRef = useRef(null);
  const navigate = useNavigate();

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia(formContainerRef.current);

    mm.add(
      {
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        const items = gsap.utils.toArray(
          ".modal-form-item",
          formContainerRef.current,
        );

        if (context.conditions.reduced) {
          gsap.set(items, { opacity: 1, y: 0 });
          return undefined;
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.04,
            ease: MOTION_TOKENS.ease.out,
            clearProps: "transform",
          },
        );
        return undefined;
      },
    );

    return () => mm.revert();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus, numberOfQuestions } = formData;

    const isMissingExperience =
      experience === "" || experience === null || experience === undefined;

    if (
      !role ||
      isMissingExperience ||
      !topicsToFocus ||
      !numberOfQuestions ||
      Number(numberOfQuestions) <= 0
    ) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      //Calling ai API to generate question
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus,
          numberOfQuestions,
        },
      );

      const generatedQuestions = aiResponse.data;

      //Creating sessions
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data?.session?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={formContainerRef}
      className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center"
    >
      <h3 className="modal-form-item text-lg font-semibold text-black">
        Start a New Interview Journey
      </h3>

      <p className="modal-form-item text-xs text-slate-700 mt-1.25 mb-3">
        Fill out a few quick and unlock your personalized set of interview
        questions!
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col">
        <div className="modal-form-item">
          <Input
            value={formData.role}
            onChange={({ target }) => handleChange("role", target.value)}
            label="Target Role"
            placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
            type="text"
          />
        </div>

        <div className="modal-form-item">
          <Input
            value={formData.experience}
            onChange={({ target }) => handleChange("experience", target.value)}
            label="Years of Experience"
            placeholder="(e.g., 1 year, 3 years, 5+ years)"
            type="number"
          />
        </div>

        <div className="modal-form-item">
          <Input
            value={formData.topicsToFocus}
            onChange={({ target }) =>
              handleChange("topicsToFocus", target.value)
            }
            label="Topics to Focus On"
            placeholder="(Comma-Seperated, e.g., React, Node.js, MongoDB)"
            type="text"
          />
        </div>

        <div className="modal-form-item">
          <Input
            value={formData.description}
            onChange={({ target }) => handleChange("description", target.value)}
            label="Description"
            placeholder="(Any specific goals or notes in this session.)"
            type="text"
          />
        </div>

        <div className="modal-form-item">
          <Input
            value={formData.numberOfQuestions}
            onChange={({ target }) =>
              handleChange("numberOfQuestions", target.value)
            }
            label="Number Question"
            placeholder="Number of Questions want to generate"
            type="number"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <div className="modal-form-item">
          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={isLoading}
          >
            {isLoading && <SpinnerLoader />}Create Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSessionForms;
