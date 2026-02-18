// Minimal type stub for mammoth — replaced by the package's own types once installed.
declare module "mammoth" {
  interface ExtractionOptions {
    arrayBuffer: ArrayBuffer;
  }
  interface ExtractionResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }
  function extractRawText(options: ExtractionOptions): Promise<ExtractionResult>;
}
