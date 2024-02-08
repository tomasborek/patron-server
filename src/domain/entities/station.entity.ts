import { IBoxDTO } from './box.entity';
import { BoxState } from './enums';

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
