import { useEffect, useState } from "react";
import { api } from "./api.ts";

export default function App() {
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    api.content.listFiles
      .query()
      .then((result) => {
        setFileNames(result);
      })
      .catch((error) => {
        console.warn(error);
      });
  }, []);

  return (
    <>
      <h1>Files</h1>
      <ul>
        {fileNames.map((fileName) => (
          <li key={fileName}>{fileName}</li>
        ))}
      </ul>
    </>
  );
}
