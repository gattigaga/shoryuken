"use client";

import { motion, useAnimationControls } from "framer-motion";
import { FC, useEffect, useState } from "react";
import Image from "next/image";

import useTailwindBreakpoint from "../hooks/use-tailwind-breakpoint";

type Props = {
  images: string[];
  activeIndex: number;
  onChangeIndex?: (index: number) => void;
};

const CoreImageSlider: FC<Props> = ({ images, activeIndex, onChangeIndex }) => {
  const [itemWidth, setItemWidth] = useState(0);
  const controls = useAnimationControls();
  const breakpoint = useTailwindBreakpoint();

  useEffect(() => {
    const updateItemWidth = () => {
      if (typeof document !== "undefined") {
        let result = 0;

        switch (breakpoint) {
          case "xl":
            result =
              ((document.documentElement.clientWidth - 256 - 96) / 3) * 2 + 48;
            break;

          case "md":
            result = document.documentElement.clientWidth - 128;
            break;

          default:
            result = document.documentElement.clientWidth - 32;
            break;
        }

        setItemWidth(result);
      }
    };

    updateItemWidth();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateItemWidth);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateItemWidth);
      }
    };
  }, []);

  useEffect(() => {
    controls.start({
      x: -itemWidth * activeIndex,
      transition: {
        ease: "easeInOut",
      },
    });
  }, [itemWidth, activeIndex]);

  return (
    <div className="w-full aspect-[4/3] rounded overflow-hidden">
      <motion.div
        style={{ width: itemWidth * images.length }}
        className="flex"
        drag="x"
        dragConstraints={{
          left: -itemWidth * (images.length - 1),
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
          <Image
            key={index}
            style={{ width: itemWidth }}
            className="aspect-[4/3]"
            src={image}
            alt="Core Image"
            draggable={false}
            width={2560}
            height={1920}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CoreImageSlider;
