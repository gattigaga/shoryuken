"use client";

import { motion, useAnimationControls } from "framer-motion";
import { FC, useEffect } from "react";
import CoreInfo from "./CoreInfo";
import useTailwindBreakpoint from "../hooks/use-tailwind-breakpoint";

type Props = {
  items: {
    id: number;
    title: string;
    description: string;
  }[];
  activeIndex: number;
  onChangeIndex?: (index: number) => void;
};

const CoreInfoSlider: FC<Props> = ({ items, activeIndex, onChangeIndex }) => {
  const controls = useAnimationControls();
  const breakpoint = useTailwindBreakpoint();

  const itemWidth = (() => {
    if (typeof document === "undefined") {
      return 0;
    }

    const paddingX = breakpoint === "md" ? 128 : 32;

    return document.documentElement.clientWidth - paddingX;
  })();

  useEffect(() => {
    controls.start({
      x: -itemWidth * activeIndex,
      transition: {
        ease: "easeInOut",
      },
    });
  }, [itemWidth, activeIndex]);

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        style={{ width: itemWidth * items.length }}
        className="flex"
        drag="x"
        dragConstraints={{
          left: -itemWidth * (items.length - 1),
          right: 0,
        }}
        onDragEnd={(event, info) => {
          const newActiveIndex = (() => {
            const { x } = info.offset;

            if (x < -72) {
              return Math.min(items.length - 1, activeIndex + 1);
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
        {items.map((item, index) => (
          <CoreInfo
            key={item.id}
            title={item.title}
            description={item.description}
            isActive={true}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CoreInfoSlider;
