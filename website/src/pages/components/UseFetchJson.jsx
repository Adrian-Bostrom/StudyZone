import { useState, useEffect } from "react";
//url är file path och bodyData är användarens sessionToken.
const UseFetchJson = (url, bodyData) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const backendPort = 5000;
  const baseUrl = `http://studyzone.ddns.net:5000`;
  const fullUrl = `${baseUrl}${url}`; // Combine base URL with the endpoint
  useEffect(() => {
    fetch(fullUrl, {  
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
  }, [fullUrl, bodyData]);

  return { data, error };
};

export default UseFetchJson;
