export function normalizeText(value: string | undefined | null): string {
    if (!value) return "";
    return value.normalize("NFC");
  }