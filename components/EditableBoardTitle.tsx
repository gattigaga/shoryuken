import React, { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onSubmit?: (value: string) => void;
};

const EditableBoardTitle: React.FC<Props> = ({ value, onSubmit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
  const refText = useRef<HTMLHeadingElement>(null);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refText.current) {
      setInputWidth(refText.current.offsetWidth + 24);
    }
  }, [value]);

  return (
    <div>
      {!isEditing && (
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);

            setTimeout(() => {
              refInput.current?.focus();
            }, 100);
          }}
        >
          <h1
            ref={refText}
            className="text-white text-lg font-semibold inline-block"
          >
            {value}
          </h1>
        </button>
      )}
      {isEditing && (
        <input
          ref={refInput}
          className="py-0 px-1 rounded text-lg font-semibold"
          style={{ width: inputWidth }}
          type="text"
          defaultValue={value}
          onKeyDown={(event) => {
            if (["Enter", "Escape"].includes(event.key)) {
              refInput.current?.blur();
            }
          }}
          onBlur={(event) => {
            setIsEditing(false);
            onSubmit?.(event.target.value);
          }}
        />
      )}
    </div>
  );
};

export default EditableBoardTitle;
