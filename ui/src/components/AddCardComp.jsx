import { useState, useRef, useEffect } from "react";

function AddCardComp() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const textareaRef1 = useRef(null);
  const textareaRef2 = useRef(null);

  const autoResize = (textareaRef, value) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize(textareaRef1, value1);
    autoResize(textareaRef2, value2);
  }, [value1, value2]);

  const handleDeleteCard = () => {
    setValue1("");
    setValue2("");
  };

  return (
    <div className="relative rounded-2xl bg-neutral text-neutral-content w-full p-4 pl-12 pr-12 flex flex-row items-center gap-8">
      <button onClick={handleDeleteCard} className="absolute top-2 left-4 ">
        &times;
      </button>

      <div className="flex flex-row items-center gap-8 flex-1">
        <textarea
          placeholder="Type your text here!"
          className="textarea w-full resize-none p-2"
          ref={textareaRef1}
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          style={{ minHeight: "40px" }}
        />
        <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-base-100">
          img
        </button>
      </div>

      <div className="divider divider-horizontal"></div>

      <div className="flex flex-row items-center gap-8 flex-1">
        <textarea
          placeholder="Type your text here!"
          className="textarea w-full resize-none p-2"
          ref={textareaRef2}
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          style={{ minHeight: "40px" }}
        />
        <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-base-100">
          img
        </button>
      </div>
    </div>
  );
}

export default AddCardComp;
