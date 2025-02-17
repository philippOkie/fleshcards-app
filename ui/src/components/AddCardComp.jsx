import { useState, useRef, useEffect } from "react";

import PicturePicker from "./PicturePicker";

function AddCardComp({
  initialFrontText,
  initialBackText,
  onDelete,
  number,
  cardId,
  onSave,
}) {
  const [frontText, setFrontText] = useState(initialFrontText || "");
  const [backText, setBackText] = useState(initialBackText || "");
  const [showPicturePicker, setShowPicturePicker] = useState(false);
  const [activeSide, setActiveSide] = useState(null);
  const frontTextareaRef = useRef(null);
  const backTextareaRef = useRef(null);

  const autoResizeTextarea = (textareaRef) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea(frontTextareaRef);
    autoResizeTextarea(backTextareaRef);
  }, [frontText, backText]);

  const handleBlur = () => {
    if (onSave) {
      onSave(cardId, "textForward", frontText);
      onSave(cardId, "textBack", backText);
    }
  };

  const handleImageButtonClick = (side) => {
    setActiveSide((prevState) => (prevState === side ? null : side));
    setShowPicturePicker((prevState) =>
      prevState && activeSide === side ? false : true
    );
  };

  return (
    <>
      <div className="relative rounded-2xl bg-neutral text-neutral-content w-full p-4 pl-12 pr-12 flex flex-row items-center gap-8">
        {number && (
          <span className="absolute top-2 right-4 text-lg font-bold text-gray-600">
            {number}
          </span>
        )}

        <button onClick={onDelete} className="absolute top-2 left-4">
          &times;
        </button>

        <div className="flex flex-row items-center gap-8 flex-1">
          <textarea
            placeholder="Type your text here! (Front side)"
            className="textarea w-full resize-none p-2"
            ref={frontTextareaRef}
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            onBlur={handleBlur}
            style={{ minHeight: "40px", fontSize: "16px" }}
          />

          <button
            className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ${
              activeSide === "front" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => handleImageButtonClick("front")}
          >
            IMAGE
          </button>
        </div>

        <div className="divider divider-horizontal"></div>

        <div className="flex flex-row items-center gap-8 flex-1">
          <textarea
            placeholder="Type your text here! (Back side)"
            className="textarea w-full resize-none p-2"
            ref={backTextareaRef}
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            onBlur={handleBlur}
            style={{ minHeight: "40px", fontSize: "16px" }}
          />

          <button
            className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ${
              activeSide === "back" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => handleImageButtonClick("back")}
          >
            IMAGE
          </button>
        </div>
      </div>

      {showPicturePicker && <PicturePicker side={activeSide} />}
    </>
  );
}

export default AddCardComp;
