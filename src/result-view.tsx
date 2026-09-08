import { Action, ActionPanel, Detail, getSelectedText, Icon, openExtensionPreferences } from "@raycast/api";
import { useEffect, useState } from "react";
import { generate, Task } from "./lib";

export function ResultView({
  task,
  title,
  initialResult,
  initialError,
}: {
  task: Task;
  title: string;
  initialResult?: string;
  initialError?: string;
}) {
  const [result, setResult] = useState(initialResult ?? "");
  const [error, setError] = useState(initialError ?? "");
  const [loading, setLoading] = useState(initialResult === undefined && initialError === undefined);

  useEffect(() => {
    if (initialResult !== undefined || initialError !== undefined) return;
    const controller = new AbortController();
    async function load() {
      try {
        let text: string;
        try {
          text = await getSelectedText();
        } catch {
          throw new Error(
            "Select text in an app, then run this command again. Check Raycast’s Accessibility permission if selection cannot be read.",
          );
        }
        if (!text.trim()) throw new Error("Select text in an app, then run this command again.");
        if (controller.signal.aborted) return;
        const output = await generate(task, text, controller.signal);
        if (!controller.signal.aborted) setResult(output);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [task, initialResult, initialError]);

  return (
    <Detail
      navigationTitle={title}
      isLoading={loading}
      markdown={loading ? "Processing selected text…" : error ? `## Could not process text\n\n${error}` : result}
      actions={
        <ActionPanel>
          {result && <Action.CopyToClipboard title="Copy Result" content={result} />}
          {result && <Action.Paste title="Paste Result" content={result} />}
          <Action title="Open Extension Preferences" icon={Icon.Gear} onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
