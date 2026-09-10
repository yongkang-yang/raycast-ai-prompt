import { Action, ActionPanel, Detail, getSelectedText, Icon, openExtensionPreferences } from "@raycast/api";
import { useEffect, useState } from "react";
import { generate, Task } from "./lib";

export function ResultView({ task, title }: { task: Task; title: string }) {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Raycast reuses an already-open command's window instead of remounting
  // it on a repeat hotkey press, so there's no automatic signal telling
  // this component the selection may have changed. Enter is pinned to
  // Refresh below rather than Paste, since there's no reliable way to tell
  // whether a result already on screen is still current.
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError("");
    setResult("");
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
  }, [task, refreshCount]);

  return (
    <Detail
      navigationTitle={title}
      isLoading={loading}
      markdown={loading ? "Processing selected text…" : error ? `## Could not process text\n\n${error}` : result}
      actions={
        <ActionPanel>
          <Action
            title="Refresh (Read Selection Again)"
            icon={Icon.ArrowClockwise}
            onAction={() => setRefreshCount((count) => count + 1)}
          />
          {result && (
            <Action.Paste
              title="Paste Result"
              content={result}
              shortcut={{
                macOS: { modifiers: ["cmd"], key: "return" },
                Windows: { modifiers: ["ctrl"], key: "return" },
              }}
            />
          )}
          {result && <Action.CopyToClipboard title="Copy Result" content={result} />}
          <Action title="Open Extension Preferences" icon={Icon.Gear} onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
