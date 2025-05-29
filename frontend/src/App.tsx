import { useQuery } from "@tanstack/react-query";
import { api } from "./core/trpcApi.ts";

export default function App() {
  const fileNamesQuery = useQuery(api.content.listFiles.queryOptions());

  return (
    <>
      <h1>Files</h1>
      <ul>
        {fileNamesQuery.data?.map((fileName) => (
          <li key={fileName}>{fileName}</li>
        ))}
      </ul>
    </>
  );
}
