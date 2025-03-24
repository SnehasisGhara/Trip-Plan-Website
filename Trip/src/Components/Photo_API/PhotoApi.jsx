import { useState, useEffect } from "react";
import axios from "axios";

const usePhotoApi = (location) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || location === "Unknown Location") {
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      setLoading(true);
      setError(null);
      try {
        // First, search for the page
        const searchResponse = await axios.get(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            location
          )}&format=json&origin=*`
        );

        if (!searchResponse.data.query?.search?.length) {
          console.log("No Wikipedia entries found for:", location);
          setImageUrl(null);
          return;
        }

        const pageTitle = searchResponse.data.query.search[0].title;

        // Then get the image for the first result
        const imageResponse = await axios.get(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            pageTitle
          )}&prop=pageimages&format=json&pithumbsize=1000&origin=*`
        );

        const pages = imageResponse.data.query?.pages;
        if (!pages) {
          throw new Error("No pages found in response");
        }

        const page = Object.values(pages)[0];

        if (page?.thumbnail?.source) {
          console.log("Found image:", page.thumbnail.source);
          setImageUrl(page.thumbnail.source);
        } else {
          console.log("No image found for:", location);
          setImageUrl(null);
        }
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(err.message);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [location]);

  return { imageUrl, loading, error };
};

export default usePhotoApi;


