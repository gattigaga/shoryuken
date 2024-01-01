"use client";

import { motion, useAnimationControls } from "framer-motion";
import { FC, useEffect } from "react";
import useTailwindBreakpoint from "../hooks/use-tailwind-breakpoint";

type Props = {
  items: {
    id: number;
    name: string;
    role: string;
    companyLogo: string;
    description: string;
  }[];
  activeIndex: number;
  onChangeIndex?: (index: number) => void;
};

const TestimonySlider: FC<Props> = ({ items, activeIndex, onChangeIndex }) => {
  const controls = useAnimationControls();
  const breakpoint = useTailwindBreakpoint();

  const itemWidth = (() => {
    if (typeof document === "undefined") {
      return 0;
    }

    let paddingX = 0;

    switch (breakpoint) {
      case "xl":
        paddingX = 256;
        break;

      case "md":
        paddingX = 128;
        break;

      default:
        paddingX = 32;
        break;
    }

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
    <div className="w-full h-[36rem] rounded shadow-lg border overflow-hidden md:h-96">
      <motion.div
        style={{ width: itemWidth * items.length }}
        className="flex h-full"
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
          <div
            key={index}
            style={{ width: itemWidth }}
            className="p-8 bg-white flex flex-col relative overflow-hidden"
          >
            <img
              className="absolute -top-8 -left-16 opacity-10 w-[28rem] max-w-lg"
              src="/images/bg-testimony.svg"
              alt="Testimony Background"
            />
            <div className="flex flex-col h-full relative">
              <p className="text-xl leading-relaxed text-slate-700">
                {item.description}
              </p>
              <div className="border-b border-slate-700 mb-6 mt-auto" />
              <p className="text-sm text-slate-700 font-bold">{item.name}</p>
              <p className="text-sm text-slate-700 mb-6">{item.role}</p>
              <img
                className="w-24 object-contain"
                src={item.companyLogo}
                alt="Company Logo"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TestimonySlider;
