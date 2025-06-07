import { queryApi } from "./core/trpcApi.ts";
import FileForm from "./FileForm.tsx";
import FileList from "./FileList.tsx";
import { useSubscription } from "@trpc/tanstack-react-query";

export default function App() {
  const files$ = useSubscription(
    queryApi.content.listFiles$.subscriptionOptions()
  );

  return (
    <div className="flex place-content-center size-full">
      <div className="flex flex-col gap-y-8 p-8 min-w-xl">
        <FileForm />
        <FileList files={files$.data} />
      </div>
    </div>
  );
}
