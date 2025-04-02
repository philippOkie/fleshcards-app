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
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:3000/api/pictures/search?query=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch pictures: ${response.status}`);
        }

        const { results } = await response.json();

        cacheRef.current[query] = results;
        setPictures(results);
      } catch (error) {
        setError(error.message || "An error occurred while fetching pictures");
        console.error("Picture search error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPictures();
  }, [query]);

  if (isLoading)
    return <div className="p-4 text-center">Loading pictures...</div>;
  if (error)
    return <div className="p-4 text-center text-error">Error: {error}</div>;
  if (!query || query.trim() === "")
    return (
      <div className="p-4 text-center">Enter text to search for pictures.</div>
    );

  return (
    <div className="relative rounded-2xl bg-neutral text-neutral-content w-full p-4 pl-12 pr-12 flex flex-row items-center gap-8 overflow-x-auto">
      {pictures.map((pic) => (
        <div
          key={pic.id}
          className="avatar cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onSelectImage(side, pic.urls)}
        >
          <div className="w-32 rounded">
            <img src={pic.urls} alt={pic.alt_description || "Picture"} />
          </div>
        </div>
      ))}
      <div className="w-32 h-32 rounded-full cursor-pointer flex items-center justify-center text-4xl font-bold text-gray-600 hover:bg-base-300 transition-colors">
        +
      </div>
    </div>
  );
}

export default PicturePicker;
