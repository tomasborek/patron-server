export interface IUserReservationDTO {
  id: string;
  createdAt: Date;
  institution: {
    id: string;
    name: string;
  };
  station: {
    id: string;
    name: string;
    box: {
      id: string;
      localId: number;
    };
  };
}

export interface IReservation {
  id: string;
  createdAt: Date;
  boxId: string;
  userId: string;
  cancelled: boolean;
}
