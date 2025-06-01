import { useQuery } from "@tanstack/react-query";
import { api, queryApi } from "./core/trpcApi.ts";
import FileForm from "./FileForm.tsx";
import Link from "./ui/Link.tsx";
import Button from "./ui/Button.tsx";
import Heading from "./ui/Heading.tsx";

export default function App() {
  const fileNamesQuery = useQuery(queryApi.content.listFiles.queryOptions());

  return (
    <>
      <Heading>Files</Heading>
      <ul>
        {fileNamesQuery.data?.map((info) => (
          <li key={info.href} className="flex place-items-center">
            <Link href={info.href} className="flex-1">
              {info.relativePath}
            </Link>
            <Button
              className="flex-1"
              onClick={async () => {
                await api.content.deleteFile.mutate({
                  fileName: info.basename,
                });
                await fileNamesQuery.refetch();
              }}
            >
              delete
            </Button>
          </li>
        ))}
      </ul>
      <FileForm onSubmitSuccess={fileNamesQuery.refetch} />
    </>
  );
}
