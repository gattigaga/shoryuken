"use client";

import { motion, useAnimationControls } from "framer-motion";
import { FC, useEffect } from "react";

type Props = {
  images: string[];
  activeIndex: number;
  onChangeIndex?: (index: number) => void;
};

const CoreImageSlider: FC<Props> = ({ images, activeIndex, onChangeIndex }) => {
  const controls = useAnimationControls();

  const imageWidth = document.documentElement.clientWidth - 32;

  useEffect(() => {
    controls.start({
      x: -imageWidth * activeIndex,
      transition: {
        ease: "easeInOut",
      },
    });
  }, [imageWidth, activeIndex]);

  return (
    <div className="w-full aspect-[4/3] overflow-hidden">
      <motion.div
        style={{ width: imageWidth * images.length }}
        className="flex"
        drag="x"
        dragConstraints={{
          left: -imageWidth * (images.length - 1),
          right: 0,
        }}
        onDragEnd={(event, info) => {
          const newActiveIndex = (() => {
            const { x } = info.offset;

            if (x < -72) {
              return Math.min(images.length - 1, activeIndex + 1);
            }

            if (x > 72) {
              return Math.max(0, activeIndex - 1);
            }

            return activeIndex;
          })();

          onChangeIndex?.(newActiveIndex);
        }}
        animate={controls}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{ width: imageWidth }}
            className="aspect-[4/3]"
          >
            <img className="w-full h-full" src={image} alt="Core Image" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CoreImageSlider;
