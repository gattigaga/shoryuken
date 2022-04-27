import React, { useState, useRef, useEffect } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  id: string | number;
  index: number;
  title: string;
  onSubmitTitle?: (value: string) => void;
  onClickRemove?: () => void;
};

const List: React.FC<Props> = ({
  id,
  index,
  title,
  onSubmitTitle,
  onClickRemove,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) {
      refInput.current?.select();
    }
  }, [isEditingTitle]);

  return (
    <Draggable draggableId={`list-${id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="shrink-0 w-80 p-2 bg-slate-300 rounded mr-2"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="w-full flex items-center mb-2">
            {!isEditingTitle ? (
              <button
                className="flex-1 text-left px-2 py-1 text-sm text-slate-700 font-semibold"
                type="button"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </button>
            ) : (
              <input
                ref={refInput}
                className="w-64 flex-1 px-2 py-1 text-sm text-slate-700 font-semibold rounded"
                type="text"
                defaultValue={title}
                onKeyDown={(event) => {
                  if (["Enter", "Escape"].includes(event.key)) {
                    refInput.current?.blur();
                  }
                }}
                onBlur={(event) => {
                  setIsEditingTitle(false);
                  onSubmitTitle?.(event.target.value);
                }}
              />
            )}
            <button
              className="ml-2 w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:text-slate-600 hover:bg-slate-400"
              type="button"
              onClick={onClickRemove}
            >
              <MdClose size={24} />
            </button>
          </div>
          <button
            className="w-full px-2 py-1 rounded flex items-center text-slate-500 hover:text-slate-600 hover:bg-slate-400"
            type="button"
          >
            <MdAdd size={24} />
            <p className="ml-2 text-xs">Add a card</p>
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default List;
