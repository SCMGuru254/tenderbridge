/// <reference types="https://deno.land/x/deno/cli/dts/lib.deno.ns.d.ts" />

declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

export {};
