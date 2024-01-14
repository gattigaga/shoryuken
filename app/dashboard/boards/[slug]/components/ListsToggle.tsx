import React, { FC } from "react";
import { useCellValues, usePublisher } from "@mdxeditor/gurx";
import {
  applyListType$,
  currentListType$,
  iconComponentFor$,
  SingleChoiceToggleGroup,
} from "@mdxeditor/editor";

// It's a custom component that used inside MDXEditor toolbar.
// I need to remove Check List feature.

const ListsToggle: FC = () => {
  const [currentListType, iconComponentFor] = useCellValues(
    currentListType$,
    iconComponentFor$
  );
  const applyListType = usePublisher(applyListType$);
  return (
    <SingleChoiceToggleGroup
      value={currentListType || ""}
      items={[
        {
          title: "Bulleted list",
          contents: iconComponentFor("format_list_bulleted"),
          value: "bullet",
        },
        {
          title: "Numbered list",
          contents: iconComponentFor("format_list_numbered"),
          value: "number",
        },
      ]}
      onChange={applyListType}
    />
  );
};

export default ListsToggle;
