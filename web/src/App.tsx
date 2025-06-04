import { useQuery } from "@tanstack/react-query";
import { queryApi, queryClient } from "./core/trpcApi.ts";
import FileForm from "./FileForm.tsx";
import FileList from "./FileList.tsx";

queryClient.prefetchQuery(
  queryApi.content.listFiles.queryOptions(undefined, {
    staleTime: 5000,
  })
);

export default function App() {
  const fileNames$ = useQuery(queryApi.content.listFiles.queryOptions());

  return (
    <div className="flex place-content-center size-full">
      <div className="flex flex-col gap-y-8 p-8 min-w-xl">
        <FileForm onSubmitSuccess={fileNames$.refetch} />
        <FileList files={fileNames$.data} onChange={fileNames$.refetch} />
      </div>
    </div>
  );
}
