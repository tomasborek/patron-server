interface IBoxUsecase {
  createReservation: (boxId: string, userId: string) => Promise<void>;
}

export default IBoxUsecase;
