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
  targetLanguage,
  nativeLanguage,
}) {
  const [frontText, setFrontText] = useState(initialFrontText);
  const [backText, setBackText] = useState(initialBackText);
  const [frontImageUrl, setFrontImageUrl] = useState(initialImageUrlForward);
  const [backImageUrl, setBackImageUrl] = useState(initialImageUrlBack);
  const [isPicturePickerVisible, setIsPicturePickerVisible] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);

  const frontTextareaRef = useRef(null);
  const backTextareaRef = useRef(null);
  const frontImageRef = useRef(null);
  const backImageRef = useRef(null);

  const resizeTextarea = (textareaRef, imageRef) => {
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
    resizeTextarea(frontTextareaRef, frontImageRef);
    resizeTextarea(backTextareaRef, backImageRef);
  }, [frontText, backText, frontImageUrl, backImageUrl]);

  const handleImageToggle = (side) => {
    setSelectedSide((prev) => (prev === side ? null : side));
    setIsPicturePickerVisible((prev) => selectedSide !== side);
  };

  const handleImageSelect = async (side, imageUrl) => {
    const field = side === "front" ? "imageUrlForward" : "imageUrlBack";
    try {
      await onSave(cardId, field, imageUrl);
      side === "front" ? setFrontImageUrl(imageUrl) : setBackImageUrl(imageUrl);
    } catch (error) {
      console.error("Error saving image:", error);
    }
    setIsPicturePickerVisible(false);
    setSelectedSide(null);
  };

  const handleImageRemove = (side) => {
    const field = side === "front" ? "imageUrlForward" : "imageUrlBack";
    onSave(cardId, field, "");
    side === "front" ? setFrontImageUrl("") : setBackImageUrl("");
  };

  const translateText = async (text, sourceLang, targetLang) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/service/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
            sourceLanguage: sourceLang || "",
            targetLanguage: targetLang,
          }),
        }
      );

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();
      return data.translations[0].text;
    } catch (error) {
      console.error("Translation error:", error);
      return "";
    }
  };

  const handleFrontTextBlur = async () => {
    if (
      !backText.trim() &&
      frontText.trim() &&
      targetLanguage &&
      nativeLanguage
    ) {
      const translatedText = await translateText(
        frontText,
        nativeLanguage,
        targetLanguage
      );
      setBackText(translatedText);
      onSave(cardId, "textForward", frontText);
      onSave(cardId, "textBack", translatedText);
    }
  };

  const handleBackTextBlur = async () => {
    if (
      !frontText.trim() &&
      backText.trim() &&
      targetLanguage &&
      nativeLanguage
    ) {
      const translatedText = await translateText(
        backText,
        targetLanguage,
        nativeLanguage
      );
      setFrontText(translatedText);
      onSave(cardId, "textForward", translatedText);
      onSave(cardId, "textBack", backText);
    }
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
            onBlur={handleFrontTextBlur}
            style={{ minHeight: "40px", fontSize: "16px" }}
          />
          <div
            ref={frontImageRef}
            style={{
              backgroundImage: `url(${frontImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={`relative w-32 sm:w-24 sm:h-24 md:w-28 lg:w-32 border rounded cursor-pointer flex items-center justify-center ${
              selectedSide === "front" ? "ring ring-primary" : ""
            }`}
            onClick={() => {
              frontImageUrl
                ? handleImageRemove("front")
                : handleImageToggle("front");
            }}
          >
            {!frontImageUrl && (
              <span className="text-gray-500 font-bold">IMAGE</span>
            )}
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
            onBlur={handleBackTextBlur}
            style={{ minHeight: "40px", fontSize: "16px" }}
          />
          <div
            ref={backImageRef}
            style={{
              backgroundImage: `url(${backImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={`relative w-32 sm:w-24 sm:h-24 md:w-28 lg:w-32 border rounded cursor-pointer flex items-center justify-center ${
              selectedSide === "back" ? "ring ring-primary" : ""
            }`}
            onClick={() => {
              backImageUrl
                ? handleImageRemove("back")
                : handleImageToggle("back");
            }}
          >
            {!backImageUrl && (
              <span className="text-gray-500 font-bold">IMAGE</span>
            )}
          </div>
        </div>
      </div>

      {isPicturePickerVisible && (
        <PicturePicker
          side={selectedSide}
          query={frontText}
          onSelectImage={handleImageSelect}
        />
      )}
    </>
  );
}

export default AddCardComp;
