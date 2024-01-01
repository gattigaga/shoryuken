"use client";

import { FC, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import SliderPagination from "./SliderPagination";
import TestimonySlider from "./TestimonySlider";

const TestimonySection: FC = () => {
  const [activeTestimonyIndex, setActiveTestimonyIndex] = useState(0);
  const { _ } = useLingui();

  const testimonies = [
    {
      id: 1,
      name: "Kazuya Mishima",
      role: "Head of G-Corporation",
      companyLogo: "/images/placeholder_16-9.png",
      description: _(
        msg`With Shoryuken, we have gained better visibility into our tasks, streamlined our workflows, and improved collaboration among team members.`
      ),
    },
    {
      id: 2,
      name: "Yasushi Akimoto",
      role: "Producer of 48 Family",
      companyLogo: "/images/placeholder_16-9.png",
      description: _(
        msg`As a Producer of the 48 Family, I have found Shoryuken to be an invaluable tool for managing the activities and schedules of our idol group.`
      ),
    },
    {
      id: 3,
      name: "Hiden Aruto",
      role: "CEO of Hiden Intelligence",
      companyLogo: "/images/placeholder_16-9.png",
      description: _(
        msg`Shoryuken has transformed how we manage our AI company at Hiden Intelligence. With its boards and task assignment features, we streamline projects, enhance collaboration, and meet deadlines.`
      ),
    },
  ];

  return (
    <div className="px-4 pt-32 pb-20 bg-gradient-to-b from-white to-blue-100 md:px-16 md:pt-24 xl:px-32 xl:flex xl:flex-col">
      <div className="hidden xl:flex xl:gap-x-4 xl:justify-end xl:mb-6 xl:w-fit xl:self-end">
        <SliderPagination
          totalItems={testimonies.length}
          activeIndex={activeTestimonyIndex}
          onClickIndex={setActiveTestimonyIndex}
        />
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200"
          type="button"
          onClick={() => {
            setActiveTestimonyIndex(Math.max(0, activeTestimonyIndex - 1));
          }}
        >
          <MdChevronLeft className="text-slate-700" size={20} />
        </button>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200"
          type="button"
          onClick={() => {
            setActiveTestimonyIndex(
              Math.min(testimonies.length - 1, activeTestimonyIndex + 1)
            );
          }}
        >
          <MdChevronRight className="text-slate-700" size={20} />
        </button>
      </div>

      <TestimonySlider
        items={testimonies}
        activeIndex={activeTestimonyIndex}
        onChangeIndex={setActiveTestimonyIndex}
      />

      <div className="mt-8 xl:hidden">
        <SliderPagination
          totalItems={testimonies.length}
          activeIndex={activeTestimonyIndex}
          onClickIndex={setActiveTestimonyIndex}
        />
      </div>
    </div>
  );
};

export default TestimonySection;
