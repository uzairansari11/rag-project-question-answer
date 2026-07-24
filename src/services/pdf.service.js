import { Document } from '@langchain/core/documents';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

class PdfService {
  /**
   * Parse a PDF buffer into LangChain Documents.
   *
   * @param {Buffer} pdfBuffer
   * @param {Object} metadata
   * @param {string} metadata.userId
   * @param {string} metadata.documentId
   * @param {string} metadata.fileName
   * @returns {Promise<Document[]>}
   */
  async parse(pdfBuffer, metadata) {
    const pdf = await getDocument({
      data: new Uint8Array(pdfBuffer),
    }).promise;

    const documents = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item) => item.str).join(' ');

      const cleanMetadata = Object.fromEntries(
        Object.entries({
          ...metadata,
          page: pageNumber,
          totalPages: pdf.numPages,
        }).filter(([, value]) => value !== undefined),
      );

      documents.push(
        new Document({
          pageContent: pageText,
          metadata: cleanMetadata,
        }),
      );
    }

    return documents;
  }

  async extractText(pdfBuffer, metadata) {
    const documents = await this.parse(pdfBuffer, metadata);

    return documents.map((document) => ({
      pageContent: document.pageContent,
      metadata: document.metadata,
    }));
  }
}

export default new PdfService();
