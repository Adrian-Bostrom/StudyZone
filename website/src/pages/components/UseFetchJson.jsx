import { useState, useEffect } from "react";

const UseFetchJson = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(myJson => setData(myJson));
  }, [url]);

  return data;
}

export default UseFetchJson;
