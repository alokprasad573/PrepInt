import { useContext, useRef } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  useIsomorphicLayoutEffect,
} from "../../animations";

const WorkSpaceLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  const mainRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!user || !mainRef.current) return undefined;

    const mm = gsap.matchMedia(mainRef.current);

    mm.add(
      {
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        if (context.conditions.reduced) {
          gsap.set(mainRef.current, { opacity: 1 });
          return undefined;
        }

        gsap.fromTo(
          mainRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: MOTION_TOKENS.duration.quick,
            ease: MOTION_TOKENS.ease.smooth,
          },
        );
        return undefined;
      },
    );

    return () => mm.revert();
  }, [Boolean(user)]);

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      {user && (
        <main ref={mainRef} className="flex-1 pb-16">
          {children}
        </main>
      )}
    </div>
  );
};

export default WorkSpaceLayout;
