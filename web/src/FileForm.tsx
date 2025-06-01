import type { ModifyFilePayload } from "@git-db/api";
import { api } from "./core/trpcApi";

type Props = {
  onSubmitSuccess?: VoidFunction;
};

export default function FileForm({ onSubmitSuccess }: Props) {
  const onSubmit = async (data: FormData) => {
    const fileName = data.get("fileName") as string;
    const content = data.get("content") as string;
    const commitMessage = (data.get("commitMessage") as string) || undefined;

    const payload: ModifyFilePayload = {
      fileName,
      content,
      commitMessage,
    };

    await api.content.modifyFile.mutate(payload);
    onSubmitSuccess?.();
  };

  return (
    <form action={onSubmit}>
      <input
        required
        name="fileName"
        type="text"
        placeholder="File name"
      ></input>

      <textarea
        required
        name="content"
        placeholder="Text content of the file"
      ></textarea>

      <input
        type="text"
        name="commitMessage"
        placeholder="Commit message"
      ></input>

      <button type="submit">Create/Modify</button>
    </form>
  );
}
