"use client";

type SnapOptions = {
  onSuccess?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onError?: (result: unknown) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: SnapOptions) => void;
    };
  }
}

const SNAP_SCRIPT_ID = "midtrans-snap-script";
const SNAP_URL = "https://app.sandbox.midtrans.com/snap/snap.js";

export function loadSnapScript(clientKey?: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.snap) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.getElementById(SNAP_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = SNAP_SCRIPT_ID;
    script.src = SNAP_URL;
    if (clientKey) {
      script.setAttribute("data-client-key", clientKey);
    }
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("[midtrans] Failed to load Snap script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
