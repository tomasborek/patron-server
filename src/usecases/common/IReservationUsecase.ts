interface IReservationUsecase {
  cancel: (id: string, userId: string) => Promise<void>;
}

export default IReservationUsecase;
