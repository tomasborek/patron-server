export interface IBorrowedEvent {
  event: 'borrowed';
  data: {
    boxId: string;
    userId: string;
  };
}

export interface IReturnedEvent {
  event: 'returned';
  data: {
    boxId: string;
    userId: string;
  };
}
