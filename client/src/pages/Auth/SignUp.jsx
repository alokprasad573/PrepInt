import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { UserContext } from "../../context/userContext";
import { validateEmail, setCookie } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import SpinnerLoader from "../../components/loader/SpinnerLoader";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "../../animations";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const errorRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia(containerRef.current);

    mm.add(
      {
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        const items = gsap.utils.toArray(".auth-stagger", containerRef.current);

        if (context.conditions.reduced) {
          gsap.set([containerRef.current, ...items], {
            opacity: 1,
            x: 0,
            y: 0,
            clearProps: "transform",
          });
          return undefined;
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: 12, x: 8 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.36,
            stagger: 0.045,
            ease: MOTION_TOKENS.ease.out,
            clearProps: "transform",
          },
        );
        return undefined;
      },
    );

    return () => mm.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!error || !errorRef.current || prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      errorRef.current,
      { opacity: 0, y: -4 },
      { opacity: 1, y: 0, duration: 0.22, ease: MOTION_TOKENS.ease.out },
    );
    return () => tween.kill();
  }, [error]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");
    setIsLoading(true);

    // SignUp API call
    try {
      // Upload Image
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email: email,
        password: password,
        profileImageUrl: profileImageUrl,
      });

      const { token } = response.data;
      if (token) {
        setCookie("token", token, 7);
        updateUser(response.data);
        navigate("/workspace");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center"
    >
      <h3 className="auth-stagger text-lg font-semibold text-black">
        Create an Account
      </h3>
      <p className="auth-stagger text-xs text-slate-700 mt-1.25 mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        <div className="auth-stagger">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        </div>
        <div className="grid grid-cols-1 gap-1">
          <div className="auth-stagger">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
          </div>

          <div className="auth-stagger">
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
          </div>

          <div className="auth-stagger">
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </div>
        </div>

        {error && (
          <p ref={errorRef} className="text-red-500 text-xs pb-2.5">
            {error}
          </p>
        )}

        <div className="auth-stagger">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading && <SpinnerLoader />}SIGN UP
          </button>
        </div>

        <p className="auth-stagger text-[13px] text-slate-800 mt-3">
          Already have an account?{" "}
          <button
            type="button"
            className="font-medium text-amber-600 hover:text-amber-700 underline cursor-pointer"
            onClick={() => {
              if (setCurrentPage) {
                setCurrentPage("login");
              } else {
                navigate("/login");
              }
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
