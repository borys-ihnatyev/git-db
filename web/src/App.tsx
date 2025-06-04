import { useQuery } from "@tanstack/react-query";
import { queryApi } from "./core/trpcApi.ts";
import FileForm from "./FileForm.tsx";
import FileList from "./FileList.tsx";

export default function App() {
  const fileNames$ = useQuery(queryApi.content.listFiles.queryOptions());

  return (
    <div className="flex place-content-center size-full">
      <div className="flex flex-col gap-y-8 p-8 min-w-xl">
        <FileList files={fileNames$.data} onChange={fileNames$.refetch} />
        <FileForm onSubmitSuccess={fileNames$.refetch} />
      </div>
    </div>
  );
}
