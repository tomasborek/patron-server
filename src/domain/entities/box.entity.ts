import { BoxState } from '@prisma/client';

export interface IBox {
  id: string;
  localId: number;
  stationId: string;
  deleted: boolean;
  createdAt: Date;
  state: BoxState;
}
