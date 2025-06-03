import { useQuery } from "@tanstack/react-query";
import { api, queryApi } from "./core/trpcApi.ts";
import FileForm from "./FileForm.tsx";
import Link from "./ui/Link.tsx";
import Button from "./ui/Button.tsx";
import Heading from "./ui/Heading.tsx";

export default function App() {
  const fileNamesQuery = useQuery(queryApi.content.listFiles.queryOptions());

  return (
    <div className="flex place-content-center size-full">
      <div className="flex flex-col gap-y-8 p-8 min-w-xl">
        <Heading>Files</Heading>
        <ul className="flex flex-col gap-y-4">
          {fileNamesQuery.data?.map((info) => (
            <li key={info.href} className="flex place-items-center gap-2">
              <Link href={info.href} className="flex-1">
                {info.relativePath}
              </Link>
              <Button
                className="flex-0.5"
                onClick={async () => {
                  await api.content.deleteFile.mutate({
                    fileName: info.basename,
                  });
                  await fileNamesQuery.refetch();
                }}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
        <FileForm onSubmitSuccess={fileNamesQuery.refetch} />
      </div>
    </div>
  );
}
