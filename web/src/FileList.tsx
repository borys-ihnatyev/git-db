import type { FileInfo } from "@git-db/api";
import Heading from "./ui/Heading.tsx";
import Link from "./ui/Link.tsx";
import Button from "./ui/Button.tsx";
import { api } from "./core/trpcApi.ts";

type Props = {
  files?: FileInfo[];
  onChange?: VoidFunction;
};

export default function FileList({ files, onChange }: Props) {
  return (
    <>
      <Heading>
        {files?.length ? "Content files" : "Content has no files"}
      </Heading>
      {files && (
        <ul className="flex flex-col gap-y-4">
          {files.map((info) => (
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
                  onChange?.();
                }}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
