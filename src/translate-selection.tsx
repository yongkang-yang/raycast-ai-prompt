import { ResultView } from "./result-view";
import { LaunchProps } from "@raycast/api";

export default function Command({
  launchContext,
}: LaunchProps<{ launchContext: { ocrResult?: string; ocrError?: string } }>) {
  return (
    <ResultView
      task="translate"
      title={launchContext ? "OCR Translate" : "Translate & Learn"}
      initialResult={launchContext?.ocrResult}
      initialError={launchContext?.ocrError}
    />
  );
}
