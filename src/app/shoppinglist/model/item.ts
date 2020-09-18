import * as firebase from 'firebase';
import {DTO} from '../../core/model/dto';


export interface Item extends DTO {
  boughtAt?: firebase.firestore.Timestamp;
  createdAt?: firebase.firestore.Timestamp;
  createdBy?: string;
  description: string;
  listId: string;
}
