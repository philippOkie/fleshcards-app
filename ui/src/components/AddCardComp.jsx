import { useState, useRef, useEffect } from "react";

import PicturePicker from "./PicturePicker";

function AddCardComp({
  initialFrontText = "",
  initialBackText = "",
  onDelete,
  number,
  cardId,
  onSave,
  initialImageUrlForward = "",
  initialImageUrlBack = "",
}) {
  const [frontText, setFrontText] = useState(initialFrontText);
  const [backText, setBackText] = useState(initialBackText);
  const [frontImageUrl, setFrontImageUrl] = useState(initialImageUrlForward);
  const [backImageUrl, setBackImageUrl] = useState(initialImageUrlBack);
  const [showPicturePicker, setShowPicturePicker] = useState(false);
  const [activeSide, setActiveSide] = useState(null);

  const frontTextareaRef = useRef(null);
  const backTextareaRef = useRef(null);
  const frontImageRef = useRef(null);
  const backImageRef = useRef(null);

  const autoResizeTextarea = (textareaRef, imageRef) => {
    if (textareaRef.current && imageRef.current) {
      const imageHeight = imageRef.current.clientHeight;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        imageHeight
      )}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea(frontTextareaRef, frontImageRef);
    autoResizeTextarea(backTextareaRef, backImageRef);
  }, [frontText, backText, frontImageUrl, backImageUrl]);

  const handleBlur = () => {
    if (onSave) {
      onSave(cardId, "textForward", frontText);
      onSave(cardId, "textBack", backText);
    }
  };

  const handleImageButtonClick = (side) => {
    setActiveSide((prev) => (prev === side ? null : side));
    setShowPicturePicker((prev) => activeSide !== side);
  };

  const handleSelectImage = async (side, imageUrl) => {
    const field = side === "front" ? "imageUrlForward" : "imageUrlBack";
    try {
      await onSave(cardId, field, imageUrl);
      side === "front" ? setFrontImageUrl(imageUrl) : setBackImageUrl(imageUrl);
    } catch (error) {
      console.error("Error saving image:", error);
    }
    setShowPicturePicker(false);
    setActiveSide(null);
  };

  const handleRemoveImage = (side) => {
    const field = side === "front" ? "imageUrlForward" : "imageUrlBack";
    onSave(cardId, field, "");
    if (side === "front") {
      setFrontImageUrl("");
    } else {
      setBackImageUrl("");
    }
  };

  const imageBoxStyle = (side) => {
    const imageUrl = side === "front" ? frontImageUrl : backImageUrl;
    return imageUrl
      ? {
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: "transparent" };
  };

  const renderImageBoxContent = (side) => {
    const imageUrl = side === "front" ? frontImageUrl : backImageUrl;

    if (!imageUrl)
      return <span className="text-gray-500 font-bold">IMAGE</span>;
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
          <div
            ref={frontImageRef}
            style={imageBoxStyle("front")}
            className={`relative w-32 sm:w-24 sm:h-24 md:w-28 lg:w-32 border rounded cursor-pointer flex items-center justify-center ${
              activeSide === "front" ? "ring ring-primary" : ""
            }`}
            onClick={() => {
              if (frontImageUrl) {
                handleRemoveImage("front");
              } else {
                handleImageButtonClick("front");
              }
            }}
          >
            {renderImageBoxContent("front")}
          </div>
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
          <div
            ref={backImageRef}
            style={imageBoxStyle("back")}
            className={`relative w-32 sm:w-24 sm:h-24 md:w-28 lg:w-32 border rounded cursor-pointer flex items-center justify-center ${
              activeSide === "back" ? "ring ring-primary" : ""
            }`}
            onClick={() => {
              if (backImageUrl) {
                handleRemoveImage("back");
              } else {
                handleImageButtonClick("back");
              }
            }}
          >
            {renderImageBoxContent("back")}
          </div>
        </div>
      </div>

      {showPicturePicker && (
        <PicturePicker
          side={activeSide}
          query={frontText}
          onSelectImage={handleSelectImage}
        />
      )}
    </>
  );
}

export default AddCardComp;
