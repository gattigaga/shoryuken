import { motion } from "framer-motion";
import { FC } from "react";

type Props = {
  totalItems: number;
  activeIndex: number;
  onClickIndex?: (index: number) => void;
};

const SliderPagination: FC<Props> = ({
  totalItems,
  activeIndex,
  onClickIndex,
}) => {
  const itemVariants = {
    inactive: {
      width: "0.5rem",
      backgroundColor: "rgb(51, 65, 85)",
    },
    active: {
      width: "4rem",
      backgroundColor: "rgb(148, 163, 184)",
    },
  };

  return (
    <div className="flex gap-x-2 items-center justify-center">
      {[...Array(totalItems)].map((_, index) => (
        <motion.button
          key={index}
          type="button"
          className="h-2 rounded-full"
          variants={itemVariants}
          initial="inactive"
          animate={activeIndex === index ? "active" : "inactive"}
          onClick={() => onClickIndex?.(index)}
        />
      ))}
    </div>
  );
};

export default SliderPagination;
