export type UserRole = 'USER' | 'DEVELOPER';
export type UserInstitutionRole = 'USER' | 'ADMIN';
export type BoxState = 'DEFAULT' | 'EMPTY' | 'OPEN' | 'DISABLED';
export type LogAction =
  | 'RESERVATIONCREATE'
  | 'RESERVATIONCANCEL'
  | 'OPEN'
  | 'RETURN'
  | 'PHOTO'
  | 'ADD'
  | 'REMOVE'
  | 'DISABLECODE'
  | 'ACTIVATE';
