import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/inputs/Input";
import { validateEmail, setCookie } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import SpinnerLoader from "../../components/loader/SpinnerLoader";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "../../animations";

const Login = ({ setCurrentPage }) => {
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
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.05,
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

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

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

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: email,
        password: password,
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
        Welcome Back
      </h3>
      <p className="auth-stagger text-xs text-slate-700 mt-1.25 mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <div className="auth-stagger">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
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

        {error && (
          <p ref={errorRef} className="text-red-500 text-xs pb-2.5">
            {error}
          </p>
        )}

        <div className="auth-stagger">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading && <SpinnerLoader />}LOGIN
          </button>
        </div>

        <p className="auth-stagger text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-amber-600 hover:text-amber-700 underline cursor-pointer"
            onClick={() => {
              if (setCurrentPage) {
                setCurrentPage("signup");
              } else {
                navigate("/signup");
              }
            }}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
