import { type Handle, on } from "remix/ui";

const FADE_MS = 180;
const HOLD_MS = 1200;

type CopyState = "idle" | "copied" | "failed" | "resetting";

interface PromptButtonProps {
  text: string;
}

export function PromptButton(handle: Handle<PromptButtonProps>) {
  let state: CopyState = "idle";

  return () => {
    let promptLabel = `\u201C${handle.props.text}\u201D`;
    let label = state === "copied" || state === "resetting"
      ? "Copied to clipboard"
      : state === "failed"
      ? "Copy failed"
      : promptLabel;
    let active = state === "copied" || state === "failed" ||
      state === "resetting";

    return (
      <button
        type="button"
        class={`flex w-full cursor-pointer items-center gap-4 rounded-xl border-0 bg-transparent p-4 text-left text-text-primary transition-[background-color,color] duration-150 ease-out hover:bg-surface-4 hover:text-brand-blue focus-visible:bg-surface-4 focus-visible:text-brand-blue focus-visible:outline-none ${state}`}
        style={{
          background: active ? "var(--color-surface-4)" : undefined,
          color: active ? "var(--color-brand-blue)" : undefined,
        }}
        mix={on("click", async (_event, signal) => {
          try {
            await navigator.clipboard.writeText(handle.props.text);
            if (signal.aborted) return;
          } catch {
            state = "failed";
            await handle.update();
            await wait(HOLD_MS);
            if (signal.aborted) return;

            state = "resetting";
            await handle.update();
            await wait(FADE_MS);
            if (signal.aborted) return;

            state = "idle";
            handle.update();
            return;
          }

          state = "copied";
          await handle.update();
          await wait(HOLD_MS);
          if (signal.aborted) return;

          state = "resetting";
          await handle.update();
          await wait(FADE_MS);
          if (signal.aborted) return;

          state = "idle";
          await handle.update();
        })}
      >
        <span
          aria-hidden="true"
          className="flex w-6 flex-none items-center justify-center [&_svg]:block [&_svg]:h-5 [&_svg]:w-5 [&_svg]:rotate-180"
        >
          <CopyIcon />
        </span>
        <span
          className="relative flex min-w-0 flex-1 items-center text-sm leading-normal transition-opacity duration-180"
          style={{ opacity: state === "resetting" ? 0 : undefined }}
        >
          <span
            aria-hidden={state === "idle" ? true : undefined}
            className="absolute inset-0 flex items-center"
            style={{
              visibility: state === "idle" ? "hidden" : "visible",
            }}
          >
            {label}
          </span>
          <span
            aria-hidden={state === "idle" ? undefined : true}
            style={{
              visibility: state === "idle" ? "visible" : "hidden",
            }}
          >
            {promptLabel}
          </span>
        </span>
      </button>
    );
  };
}

function CopyIcon() {
  return () => (
    <svg viewBox="0 0 14 16.5" fill="none">
      <path
        d="M0.75 9.188L0.75 4.083C0.75 2.242 2.242 0.75 4.083 0.75L9.188 0.75M5.75 15.75L11.375 15.75C12.41 15.75 13.25 14.91 13.25 13.875L13.25 5.75C13.25 4.714 12.41 3.875 11.375 3.875L5.75 3.875C4.714 3.875 3.875 4.714 3.875 5.75L3.875 13.875C3.875 14.91 4.714 15.75 5.75 15.75Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
