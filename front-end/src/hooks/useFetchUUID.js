import { useState, useEffect } from "react";

const useFetchUUID = () => {
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUUID = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_END}get-uuid`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch UUID");
        }
        const { uuid } = await response.json();
        setUuid(uuid);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUUID();
  }, []);

  return { uuid, loading, error };
};

export default useFetchUUID;
