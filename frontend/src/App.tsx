import { useQuery } from "@tanstack/react-query";
import { api, queryApi } from "./core/trpcApi.ts";
import FileForm from "./FileForm.tsx";

export default function App() {
  const fileNamesQuery = useQuery(queryApi.content.listFiles.queryOptions());

  return (
    <>
      <h1>Files</h1>
      <ul>
        {fileNamesQuery.data?.map((info) => (
          <li key={info.href}>
            <a href={info.href}>{info.relativePath}</a>
            <button
              onClick={async () => {
                await api.content.deleteFile.mutate({
                  fileName: info.basename,
                });
                await fileNamesQuery.refetch();
              }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
      <FileForm onSubmitSuccess={fileNamesQuery.refetch} />
    </>
  );
}
