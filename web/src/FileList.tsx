import type { FileInfo } from "@git-db/api";
import Heading from "./ui/Heading";
import Link from "./ui/Link";
import Button from "./ui/Button";
import { api } from "./core/trpcApi";

type Props = {
  files?: FileInfo[];
  onChange?: VoidFunction;
};

export default function FileList({ files, onChange }: Props) {
  return (
    <>
      <Heading>Files</Heading>
      <ul className="flex flex-col gap-y-4">
        {files?.map((info) => (
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
    </>
  );
}
