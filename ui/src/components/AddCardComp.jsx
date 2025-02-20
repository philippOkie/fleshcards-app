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
  const [showPicturePicker, setShowPicturePicker] = useState(false);
  const [activeSide, setActiveSide] = useState(null);

  const frontTextareaRef = useRef(null);
  const backTextareaRef = useRef(null);
  const frontImageRef = useRef(null);
  const backImageRef = useRef(null);

  const authToken = localStorage.getItem("token");

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
            sourceLanguage: sourceLang || "", // Ensure this is passed as empty if not set
            targetLanguage: targetLang,
          }),
        }
      );

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();
      return data.translations[0].text; // Assuming the API returns { translations: [{ text: "translated text" }] }
    } catch (error) {
      console.error("Translation error:", error);
      return "";
    }
  };

  const handleFrontBlur = async () => {
    if (frontText.trim() && targetLanguage && nativeLanguage) {
      const translatedText = await translateText(
        frontText,
        nativeLanguage,
        targetLanguage
      );
      setBackText(translatedText); // Set the translation for the back side
      onSave(cardId, "textForward", frontText); // Save the front text
      onSave(cardId, "textBack", translatedText); // Save the translated back text
    }
  };

  const handleBackBlur = async () => {
    if (backText.trim() && targetLanguage && nativeLanguage) {
      const translatedText = await translateText(
        backText,
        targetLanguage,
        nativeLanguage
      );
      setFrontText(translatedText); // Set the translation for the front side
      onSave(cardId, "textForward", translatedText); // Save the translated front text
      onSave(cardId, "textBack", backText); // Save the back text
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
            onBlur={handleFrontBlur} // Trigger translation on blur
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
            onBlur={handleBackBlur} // Trigger translation on blur
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
            {!backImageUrl && (
              <span className="text-gray-500 font-bold">IMAGE</span>
            )}
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
