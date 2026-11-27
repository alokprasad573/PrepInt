import { useId, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { gsap, MOTION_TOKENS, prefersReducedMotion } from "../../animations";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const boxRef = useRef(null);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!boxRef.current || prefersReducedMotion()) return;
    gsap.to(boxRef.current, {
      scale: 1.008,
      duration: 0.18,
      ease: MOTION_TOKENS.ease.out,
      overwrite: "auto",
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!boxRef.current || prefersReducedMotion()) return;
    gsap.to(boxRef.current, {
      scale: 1,
      duration: 0.2,
      ease: MOTION_TOKENS.ease.out,
      overwrite: "auto",
    });
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`text-[13px] font-medium transition-colors duration-150 ${
          isFocused ? "text-amber-700" : "text-slate-800"
        }`}
      >
        {label}
      </label>
      <div ref={boxRef} className="input-box mt-1">
        <input
          id={inputId}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => onChange(e)}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 cursor-pointer transition-colors"
          >
            {showPassword ? (
              <FaRegEye size={20} className="text-amber-500" />
            ) : (
              <FaRegEyeSlash size={20} className="text-slate-400 hover:text-slate-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
