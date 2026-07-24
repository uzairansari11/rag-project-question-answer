import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

class ChunkService {
  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  async splitDocuments(documents) {
    const chunks = await this.splitter.splitDocuments(documents);

    return chunks;
  }
}

export default new ChunkService();
