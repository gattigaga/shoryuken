"use client";

import { motion, useAnimationControls } from "framer-motion";
import { FC, useEffect } from "react";

import useTailwindBreakpoint from "../hooks/use-tailwind-breakpoint";

type Props = {
  images: string[];
  activeIndex: number;
  onChangeIndex?: (index: number) => void;
};

const CoreImageSlider: FC<Props> = ({ images, activeIndex, onChangeIndex }) => {
  const controls = useAnimationControls();
  const breakpoint = useTailwindBreakpoint();

  const imageWidth = (() => {
    if (typeof document === "undefined") {
      return 0;
    }

    switch (breakpoint) {
      case "xl":
        return ((document.documentElement.clientWidth - 256 - 96) / 3) * 2 + 48;

      case "md":
        return document.documentElement.clientWidth - 128;

      default:
        return document.documentElement.clientWidth - 32;
    }
  })();

  useEffect(() => {
    controls.start({
      x: -imageWidth * activeIndex,
      transition: {
        ease: "easeInOut",
      },
    });
  }, [imageWidth, activeIndex]);

  return (
    <div className="w-full aspect-[4/3] rounded overflow-hidden">
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
          <img
            key={index}
            style={{ width: imageWidth }}
            className="aspect-[4/3]"
            src={image}
            alt="Core Image"
            draggable={false}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CoreImageSlider;
