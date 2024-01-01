"use client";

import { FC, useState } from "react";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import CoreInfo from "./CoreInfo";
import SliderPagination from "./SliderPagination";
import CoreImageSlider from "./CoreImageSlider";
import CoreInfoSlider from "./CoreInfoSlider";

const CoreSection: FC = () => {
  const [activeCoreIndex, setActiveCoreIndex] = useState(0);
  const { _ } = useLingui();

  const cores = [
    {
      id: 1,
      title: "Boards",
      description: _(
        msg`Shoryuken boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww yeah, we did it!”`
      ),
      image: "/images/home-page/boards.png",
    },
    {
      id: 2,
      title: "Lists",
      description: _(
        msg`The different stages of a task. Start as simple as To Do, Doing or Done—or build a workflow custom fit to your team’s needs. There’s no wrong way to Shoryuken.`
      ),
      image: "/images/home-page/lists.png",
    },
    {
      id: 3,
      title: "Cards",
      description: _(
        msg`Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards across lists to show their status.`
      ),
      image: "/images/home-page/cards.png",
    },
  ];

  return (
    <div className="px-4 pt-40 pb-20 bg-gradient-to-b from-white to-blue-100 md:px-16 md:pt-24 xl:px-32 xl:pt-8">
      <p className="font-bold text-slate-700 mb-2">SHORYUKEN 101</p>
      <h2 className="text-2xl font-bold mb-6 text-slate-700">
        <Trans>A productivity powerhouse</Trans>
      </h2>
      <p className="text-lg text-slate-700 leading-normal mb-8 xl:w-1/2 xl:mb-12">
        <Trans>
          Simple, flexible, and powerful. All it takes are boards, lists, and
          cards to get a clear view of who’s doing what and what needs to get
          done. Learn more in our guide for getting started.
        </Trans>
      </p>

      <div className="xl:hidden">
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

      <div className="hidden xl:grid xl:grid-cols-3 xl:gap-x-12">
        <div className="flex flex-col gap-y-4">
          {cores.map((core, index) => (
            <CoreInfo
              key={core.id}
              title={core.title}
              description={core.description}
              isActive={activeCoreIndex === index}
              onClick={() => setActiveCoreIndex(index)}
            />
          ))}
        </div>
        <div className="col-span-2">
          <CoreImageSlider
            images={cores.map((core) => core.image)}
            activeIndex={activeCoreIndex}
            onChangeIndex={setActiveCoreIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default CoreSection;
