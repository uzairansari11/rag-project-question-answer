export const documentSelectForCollection = {
  id: true,
  title: true,
  fileName: true,
  status: true,
  collectionId: true,
  createdAt: true,
  updatedAt: true,
};

export const documentSelect = {
  id: true,
  title: true,
  fileName: true,
  storageKey: true,
  mimeType: true,
  fileSize: true,
  errorMessage: true,
  status: true,
  processedAt: true,
  createdAt: true,
  collection: {
    select: {
      title: true,
    },
  },
};
