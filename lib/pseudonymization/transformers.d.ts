// Type declaration for @huggingface/transformers
// The actual package is only loaded at runtime in the Web Worker.
// This declaration satisfies TypeScript during compilation.
declare module "@huggingface/transformers" {
  export function pipeline(
    task: string,
    model: string,
    options?: Record<string, unknown>,
  ): Promise<(input: string, options?: Record<string, unknown>) => Promise<unknown[]>>;

  export const env: {
    useBrowserCache: boolean;
    cacheDir: string;
    allowRemoteModels: boolean;
    remoteHost?: string;
    remotePathTemplate?: string;
  };
}
