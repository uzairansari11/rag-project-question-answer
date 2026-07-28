export const collectionSelect = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      documents: true,
    },
  },
};

export const collectDetailSelect = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

const documentSelect = {
  id: true,
  title: true,
  fileName: true,
  status: true,
  collectionId: true,
  createdAt: true,
  updatedAt: true,
};
