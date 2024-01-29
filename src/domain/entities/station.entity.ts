import { IBoxDTO } from './box.entity';

export interface IStation {
  id: string;
  name: string;
  createdAt: Date;
  institutionId: string;
  deleted: boolean;
}

export interface IStationDTO extends IStation {
  boxes: IBoxDTO[];
}
