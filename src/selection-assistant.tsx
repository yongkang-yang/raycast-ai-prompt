import { Action, ActionPanel, Detail, getSelectedText, Icon, openExtensionPreferences } from "@raycast/api";
import { useEffect, useState } from "react";
import { classifySelection, generate, Task } from "./lib";

type Section = { heading: string; task: Task };
// Word/phrase selections get translate (its vocabulary mode) + explain;
// sentences/passages get polish (the more-used case, listed first so its
// Paste action is the default) + translate.
const WORD_SECTIONS: Section[] = [
  { heading: "Translate & Learn", task: "translate" },
  { heading: "Explain", task: "explain" },
];
const SENTENCE_SECTIONS: Section[] = [
  { heading: "Polish", task: "polish" },
  { heading: "Translate", task: "translate" },
];

export default function Command() {
  const [sections, setSections] = useState<Section[]>();
  const [results, setResults] = useState<Record<string, { text?: string; error?: string }>>({});
  const [loadError, setLoadError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      let text: string;
      try {
        text = await getSelectedText();
      } catch {
        setLoadError(
          "Select text in an app, then run this command again. Check Raycast’s Accessibility permission if selection cannot be read.",
        );
        setLoading(false);
        return;
      }
      if (!text.trim()) {
        setLoadError("Select text in an app, then run this command again.");
        setLoading(false);
        return;
      }
      const picked = classifySelection(text) === "word" ? WORD_SECTIONS : SENTENCE_SECTIONS;
      setSections(picked);
      const settled = await Promise.allSettled(
        picked.map((section) => generate(section.task, text, controller.signal)),
      );
      if (controller.signal.aborted) return;
      const next: Record<string, { text?: string; error?: string }> = {};
      settled.forEach((outcome, index) => {
        next[picked[index].heading] =
          outcome.status === "fulfilled"
            ? { text: outcome.value }
            : { error: outcome.reason instanceof Error ? outcome.reason.message : "Unexpected error" };
      });
      setResults(next);
      setLoading(false);
    }
    void load();
    return () => controller.abort();
  }, []);

  const markdown = loading
    ? "Processing selected text…"
    : loadError
      ? `## Could not process text\n\n${loadError}`
      : (sections ?? [])
          .map((section) => {
            const result = results[section.heading];
            const body = result?.error ? `_Could not generate this section: ${result.error}_` : (result?.text ?? "");
            return `## ${section.heading}\n\n${body}`;
          })
          .join("\n\n---\n\n");

  return (
    <Detail
      navigationTitle="Selection Assistant"
      isLoading={loading}
      markdown={markdown}
      actions={
        <ActionPanel>
          {sections?.map((section) => {
            const text = results[section.heading]?.text;
            if (!text) return null;
            return (
              <ActionPanel.Section key={section.heading} title={section.heading}>
                <Action.Paste title={`Paste ${section.heading}`} content={text} />
                <Action.CopyToClipboard title={`Copy ${section.heading}`} content={text} />
              </ActionPanel.Section>
            );
          })}
          <Action title="Open Extension Preferences" icon={Icon.Gear} onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
