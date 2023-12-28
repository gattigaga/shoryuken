"use client";

import { FC, useState } from "react";
import SliderPagination from "./SliderPagination";
import TestimonySlider from "./TestimonySlider";

const TestimonySection: FC = () => {
  const [activeTestimonyIndex, setActiveTestimonyIndex] = useState(0);

  const testimonies = [
    {
      id: 1,
      name: "Kazuya Mishima",
      role: "Head of G-Corporation",
      companyLogo: "/images/placeholder_16-9.png",
      description:
        "With Shoryuken, we have gained better visibility into our tasks, streamlined our workflows, and improved collaboration among team members.",
    },
    {
      id: 2,
      name: "Yasushi Akimoto",
      role: "Producer of 48 Family",
      companyLogo: "/images/placeholder_16-9.png",
      description:
        "As a Producer of the 48 Family, I have found Shoryuken to be an invaluable tool for managing the activities and schedules of our idol group.",
    },
    {
      id: 3,
      name: "Hiden Aruto",
      role: "CEO of Hiden Intelligence",
      companyLogo: "/images/placeholder_16-9.png",
      description:
        "Shoryuken has transformed how we manage our AI company at Hiden Intelligence. With its boards and task assignment features, we streamline projects, enhance collaboration, and meet deadlines.",
    },
  ];

  return (
    <div className="px-4 pt-32 pb-20 bg-gradient-to-b from-white to-blue-100">
      <TestimonySlider
        items={testimonies}
        activeIndex={activeTestimonyIndex}
        onChangeIndex={setActiveTestimonyIndex}
      />
      <div className="h-8" />
      <SliderPagination
        totalItems={testimonies.length}
        activeIndex={activeTestimonyIndex}
        onClickIndex={setActiveTestimonyIndex}
      />
    </div>
  );
};

export default TestimonySection;
