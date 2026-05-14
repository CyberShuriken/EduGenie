export async function extractPdfText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const parsed = await parser.getText();
    return parsed.text.replace(/\s+/g, " ").trim();
  } finally {
    await parser.destroy();
  }
}
