import { useState, useEffect, useRef } from "react";

function PicturePicker({ side, query, onSelectImage }) {
  const [pictures, setPictures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  useEffect(() => {
    if (!query || query.trim() === "") {
      setPictures([]);
      return;
    }

    if (cacheRef.current[query]) {
      setPictures(cacheRef.current[query]);
      return;
    }

    async function fetchPictures() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/cards/pictures?query=${encodeURIComponent(
            query
          )}&page=1&per_page=7`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pictures");
        }
        const data = await response.json();
        const results = data.results || [];
        cacheRef.current[query] = results;
        setPictures(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPictures();
  }, [query]);

  if (isLoading) return <div>Loading pictures...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!query || query.trim() === "")
    return <div>Enter text to search for pictures.</div>;

  return (
    <div className="relative rounded-2xl bg-neutral text-neutral-content w-full p-4 pl-12 pr-12 flex flex-row items-center gap-8 overflow-x-auto">
      {pictures.map((pic) => (
        <div
          key={pic.id}
          className="avatar cursor-pointer"
          onClick={() => onSelectImage(side, pic.urls)}
        >
          <div className="w-32 rounded">
            <img src={pic.urls} alt={pic.alt_description} />
          </div>
        </div>
      ))}
      <div className="w-32 h-32 rounded-full cursor-pointer flex items-center justify-center text-4xl font-bold text-gray-600">
        +
      </div>
    </div>
  );
}

export default PicturePicker;
