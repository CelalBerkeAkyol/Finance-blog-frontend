import { LazyMotion, domAnimation, m, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const animationVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const FadeInImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const animationControls = useAnimation();

  useEffect(() => {
    if (isLoaded) {
      animationControls.start("visible");
    }
  }, [isLoaded]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={animationControls}
        initial="hidden"
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={animationVariants}
      >
        <img
          src={src}
          alt={alt || ""}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      </m.div>
    </LazyMotion>
  );
};

export default FadeInImage;
