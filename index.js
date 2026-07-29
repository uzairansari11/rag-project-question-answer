const users = [
  { name: 'John Doe', value: 'easy' },
  { name: 'Jane Smith', value: 'medium' },
  { name: 'Michael Johnson', value: 'hard' },
  { name: 'Emily Davis', value: 'easy' },
  { name: 'David Wilson', value: 'medium' },
  { name: 'Sarah Brown', value: 'hard' },
  { name: 'Chris Miller', value: 'easy' },
  { name: 'Olivia Taylor', value: 'medium' },
  { name: 'Daniel Anderson', value: 'hard' },
  { name: 'Sophia Thomas', value: 'easy' },
  { name: 'James Jackson', value: 'medium' },
  { name: 'Emma White', value: 'hard' },
  { name: 'Matthew Harris', value: 'easy' },
  { name: 'Ava Martin', value: 'medium' },
  { name: 'Andrew Thompson', value: 'hard' },
  { name: 'Mia Garcia', value: 'easy' },
  { name: 'Joseph Martinez', value: 'medium' },
  { name: 'Charlotte Robinson', value: 'hard' },
  { name: 'Benjamin Clark', value: 'easy' },
  { name: 'Amelia Lewis', value: 'medium' },
];

const priorityOrder = { easy: 1, medium: 2, hard: 3 };
const result = users.sort((a, b) => priorityOrder[a.value] - priorityOrder[b.value]);
console.log('result', result);
