import bcrypt from 'bcrypt';

export const hash = (input: string) => {
  return bcrypt.hash(input, 12);
};

export const compare = (input: string, hashed: string) => {
  return bcrypt.compare(input, hashed);
};
