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

          // Prompt to Add Mini App if not already added
          try {
            const context = await sdk.context;
            if (context?.client && !context.client.added) {
               console.log("➕ Prompting to add Mini App...");
               await (sdk.actions as any).addFrame();
            }
          } catch (addError) {
             console.warn("⚠️ Failed to prompt Add Mini App:", addError);
          }

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
