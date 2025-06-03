import type { ModifyFilePayload } from "@git-db/api";
import { api } from "./core/trpcApi";
import Button from "./ui/Button";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";
import Form from "./ui/Form";

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
    <Form action={onSubmit}>
      <Input required name="fileName" type="text" placeholder="File name" />

      <TextArea
        required
        name="content"
        placeholder="Text content of the file"
      />

      <Input
        type="text"
        name="commitMessage"
        placeholder="Commit message (Optional)"
      />

      <Button type="submit">Create or Modify</Button>
    </Form>
  );
}
