import { useState, useEffect } from "react";

const UseFetchJson = (url, bodyData) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [url, bodyData]);

  return { data, error };
};

export default UseFetchJson;
