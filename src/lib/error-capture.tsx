"use client";



let lastCapturedError:
  | {
      error: unknown;
      at: number;
    }
  | undefined;

const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = {
    error,
    at: Date.now(),
  };
}

// Browser-side listeners
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    record(event.error ?? event);
  });

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      record(event.reason);
    }
  );
}

export function consumeLastCapturedError() {
  if (!lastCapturedError) {
    return undefined;
  }

  // Expire old errors
  if (
    Date.now() - lastCapturedError.at >
    TTL_MS
  ) {
    lastCapturedError = undefined;

    return undefined;
  }

  const { error } = lastCapturedError;

  lastCapturedError = undefined;

  return error;
}