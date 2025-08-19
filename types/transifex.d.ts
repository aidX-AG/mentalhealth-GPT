// types/transifex.d.ts
export {};

declare global {
  // Flag, um Doppel-Init von Transifex Native zu vermeiden
  var __tx_initialized__: boolean | undefined;
}
