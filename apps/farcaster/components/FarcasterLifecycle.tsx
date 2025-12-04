"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect } from "react";

export function FarcasterLifecycle() {
  useEffect(() => {
    const init = async () => {
      let attempts = 0;
      const maxAttempts = 5;
      
      const callReady = async () => {
        try {
          // Call ready() to hide the splash screen
          await sdk.actions.ready();
          console.log("✅ Farcaster SDK Ready called successfully");
          return true;
        } catch (error) {
          console.error(`❌ Failed to call Farcaster SDK ready (Attempt ${attempts + 1}):`, error);
          return false;
        }
      };

      // Try immediately
      if (await callReady()) return;

      // Retry loop
      const interval = setInterval(async () => {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.warn("⚠️ Max attempts reached for calling sdk.actions.ready()");
          return;
        }
        
        if (await callReady()) {
          clearInterval(interval);
        }
      }, 500); // Retry every 500ms

      return () => clearInterval(interval);
    };

    init();
  }, []);

  return null;
}
