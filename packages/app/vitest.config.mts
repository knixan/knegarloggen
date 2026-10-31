import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // brand.ts kräver ett märke – testerna körs som Knegarloggen (ROT).
    env: { NEXT_PUBLIC_APP: "knegarloggen" },
  },
});
