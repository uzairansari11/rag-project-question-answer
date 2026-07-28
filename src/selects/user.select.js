export const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const userProfileSelect = {
  ...userSelect,
  email: true,
};
