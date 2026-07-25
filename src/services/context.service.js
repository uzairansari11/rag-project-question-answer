class ContextService {
  build(chunks) {
    if (!chunks.length) {
      return '';
    }

    const context = chunks.map((chunk, index) => {
      const { fileName, page, text } = chunk.payload;
      return `
      ### Context ${index + 1}
      Source : ${fileName}
      Page : ${page}

      ${text}
      `.trim();
    });

    return context.join(`\n\n----\n\n`);
  }
}

export default new ContextService();
