import { closeMainWindow, launchCommand, LaunchType, showHUD } from "@raycast/api";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { generate } from "./lib";

const execute = promisify(execFile);

export default async function Command() {
  const directory = await mkdtemp(join(tmpdir(), "prompt-ocr-"));
  const file = join(directory, "selection.png");
  try {
    await closeMainWindow();
    try {
      await execute("/usr/sbin/screencapture", ["-i", "-s", "-x", "-t", "png", file], { timeout: 120000 });
    } catch {
      await showHUD("Capture cancelled or unavailable. Check Raycast’s Screen Recording permission if needed.");
      return;
    }
    const info = await stat(file).catch(() => undefined);
    if (!info || !info.size) {
      await showHUD("Capture cancelled");
      return;
    }
    if (info.size > 10 * 1024 * 1024) throw new Error("Image is too large. Select a smaller area (under 10 MB).");
    const image = await readFile(file);
    await rm(directory, { recursive: true, force: true });
    await showHUD("Reading and translating image…");
    const result = await generate("translate", "", undefined, `data:image/png;base64,${image.toString("base64")}`);
    await launchCommand({
      name: "selection-assistant",
      type: LaunchType.UserInitiated,
      context: { ocrResult: result },
    });
  } catch (error) {
    await launchCommand({
      name: "selection-assistant",
      type: LaunchType.UserInitiated,
      context: { ocrError: error instanceof Error ? error.message : "Could not translate image" },
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
