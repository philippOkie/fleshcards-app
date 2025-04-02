import { useState, useRef, useEffect, useCallback } from "react";
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
  const [cardState, setCardState] = useState({
    frontText: initialFrontText,
    backText: initialBackText,
    frontImageUrl: initialImageUrlForward,
    backImageUrl: initialImageUrlBack,
  });

  const [pickerState, setPickerState] = useState({
    isVisible: false,
    selectedSide: null,
  });

  const textareaRefs = {
    front: useRef(null),
    back: useRef(null),
  };

  const imageRefs = {
    front: useRef(null),
    back: useRef(null),
  };

  const { frontText, backText, frontImageUrl, backImageUrl } = cardState;
  const { isVisible: isPicturePickerVisible, selectedSide } = pickerState;

  const resizeTextarea = useCallback(
    (side) => {
      const textareaRef = textareaRefs[side];
      const imageRef = imageRefs[side];

      if (textareaRef.current && imageRef.current) {
        const imageHeight = imageRef.current.clientHeight;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.max(
          textareaRef.current.scrollHeight,
          imageHeight
        )}px`;
      }
    },
    [imageRefs, textareaRefs]
  );

  useEffect(() => {
    resizeTextarea("front");
    resizeTextarea("back");
  }, [frontText, backText, frontImageUrl, backImageUrl, resizeTextarea]);

  const handleTextChange = useCallback((side, value) => {
    setCardState((prev) => ({
      ...prev,
      [`${side}Text`]: value,
    }));
  }, []);

  const handleTextSave = useCallback(
    async (side, text) => {
      try {
        const field = side === "front" ? "textForward" : "textBack";
        await onSave(cardId, field, text);
      } catch (error) {
        console.error(`Error saving ${side} text:`, error);
      }
    },
    [cardId, onSave]
  );

  const translateText = useCallback(async (text, sourceLang, targetLang) => {
    if (!text.trim() || !sourceLang || !targetLang) return "";

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
  }, []);

  const handleTextBlur = useCallback(
    async (side) => {
      const oppositeTextKey = side === "front" ? "backText" : "frontText";
      const currentTextKey = `${side}Text`;
      const currentText = cardState[currentTextKey];
      const oppositeText = cardState[oppositeTextKey];

      await handleTextSave(side, currentText);

      if (
        !oppositeText.trim() &&
        currentText.trim() &&
        targetLanguage &&
        nativeLanguage
      ) {
        const sourceLang = side === "front" ? nativeLanguage : targetLanguage;
        const targetLang = side === "front" ? targetLanguage : nativeLanguage;

        const translatedText = await translateText(
          currentText,
          sourceLang,
          targetLang
        );

        if (translatedText) {
          setCardState((prev) => ({
            ...prev,
            [oppositeTextKey]: translatedText,
          }));

          await handleTextSave(
            side === "front" ? "back" : "front",
            translatedText
          );
        }
      }
    },
    [cardState, handleTextSave, nativeLanguage, targetLanguage, translateText]
  );

  const handleImageToggle = useCallback((side) => {
    setPickerState((prev) => ({
      selectedSide: prev.selectedSide === side ? null : side,
      isVisible: prev.selectedSide !== side,
    }));
  }, []);

  const handleImageSelect = useCallback(
    async (side, imageUrl) => {
      const field = side === "front" ? "imageUrlForward" : "imageUrlBack";
      try {
        await onSave(cardId, field, imageUrl);
        setCardState((prev) => ({
          ...prev,
          [`${side}ImageUrl`]: imageUrl,
        }));
      } catch (error) {
        console.error("Error saving image:", error);
      }

      setPickerState({
        isVisible: false,
        selectedSide: null,
      });
    },
    [cardId, onSave]
  );

  const handleImageRemove = useCallback(
    async (side) => {
      const field = side === "front" ? "imageUrlForward" : "imageUrlBack";
      try {
        await onSave(cardId, field, "");
        setCardState((prev) => ({
          ...prev,
          [`${side}ImageUrl`]: "",
        }));
      } catch (error) {
        console.error("Error removing image:", error);
      }
    },
    [cardId, onSave]
  );

  const renderCardSide = (side) => {
    const isfront = side === "front";
    const text = isfront ? frontText : backText;
    const imageUrl = isfront ? frontImageUrl : backImageUrl;

    return (
      <div className="flex flex-row items-center gap-8 flex-1">
        <textarea
          placeholder={`Type your text here! (${
            isfront ? "Front" : "Back"
          } side)`}
          className="textarea w-full resize-none p-2"
          ref={textareaRefs[side]}
          value={text}
          onChange={(e) => handleTextChange(side, e.target.value)}
          onBlur={() => handleTextBlur(side)}
          style={{ minHeight: "40px", fontSize: "16px" }}
        />
        <div
          ref={imageRefs[side]}
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`relative w-32 sm:w-24 sm:h-24 md:w-28 lg:w-32 border rounded cursor-pointer flex items-center justify-center ${
            selectedSide === side ? "ring ring-primary" : ""
          }`}
          onClick={() => {
            imageUrl ? handleImageRemove(side) : handleImageToggle(side);
          }}
        >
          {!imageUrl && <span className="text-gray-500 font-bold">IMAGE</span>}
        </div>
      </div>
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

        {renderCardSide("front")}

        <div className="divider divider-horizontal"></div>

        {renderCardSide("back")}
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
