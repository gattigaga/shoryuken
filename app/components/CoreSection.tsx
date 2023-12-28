"use client";

import classNames from "classnames";
import { FC, useState } from "react";
import CoreInfo from "./CoreInfo";
import SliderPagination from "./SliderPagination";
import CoreImageSlider from "./CoreImageSlider";
import CoreInfoSlider from "./CoreInfoSlider";

const CoreSection: FC = () => {
  const [activeCoreIndex, setActiveCoreIndex] = useState(0);

  const cores = [
    {
      id: 1,
      title: "Boards",
      description:
        "Shoryuken boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww yeah, we did it!”",
      image: "/images/placeholder_4-3.png",
    },
    {
      id: 2,
      title: "Lists",
      description:
        "The different stages of a task. Start as simple as To Do, Doing or Done—or build a workflow custom fit to your team’s needs. There’s no wrong way to Shoryuken.",
      image: "/images/placeholder_4-3.png",
    },
    {
      id: 3,
      title: "Cards",
      description:
        "Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards across lists to show their status.",
      image: "/images/placeholder_4-3.png",
    },
  ];

  return (
    <div className="px-4 pt-32 pb-20 bg-gradient-to-b from-white to-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-slate-700">
        A productivity powerhouse
      </h2>
      <p className="text-lg text-slate-700 leading-normal mb-8">
        Simple, flexible, and powerful. All it takes are boards, lists, and
        cards to get a clear view of who’s doing what and what needs to get
        done. Learn more in our guide for getting started.
      </p>

      <CoreImageSlider
        images={cores.map((core) => core.image)}
        activeIndex={activeCoreIndex}
        onChangeIndex={setActiveCoreIndex}
      />
      <div className="h-6" />
      <CoreInfoSlider
        items={cores}
        activeIndex={activeCoreIndex}
        onChangeIndex={setActiveCoreIndex}
      />
      <div className="h-6" />
      <SliderPagination
        totalItems={cores.length}
        activeIndex={activeCoreIndex}
        onClickIndex={setActiveCoreIndex}
      />
    </div>
  );
};

export default CoreSection;
