import {DTO} from '../../core/core/model/dto';

export interface List extends DTO {
  description: string;
  owner: {
    [id: string]: boolean;
  };
}
