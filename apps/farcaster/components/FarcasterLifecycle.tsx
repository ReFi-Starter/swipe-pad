"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect } from "react";

export function FarcasterLifecycle() {
  useEffect(() => {
    const init = async () => {
      try {
        // Call ready() to hide the splash screen
        await sdk.actions.ready();
        console.log("✅ Farcaster SDK Ready called");
      } catch (error) {
        console.error("❌ Failed to call Farcaster SDK ready:", error);
      }
    };

    init();
  }, []);

  return null;
}
