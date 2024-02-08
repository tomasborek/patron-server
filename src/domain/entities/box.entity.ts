import { BoxState } from '@prisma/client';

export interface IBox {
  id: string;
  localId: number;
  stationId: string;
  deleted: boolean;
  createdAt: Date;
  state: BoxState;
}

export interface IBoxDTO extends IBox {
  reserved: boolean;
}

export interface ISimpleBox {
  id: string;
  localId: number;
  state: BoxState;
}
