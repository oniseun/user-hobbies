import { Document } from 'mongoose';

export interface IHobby extends Document {
  readonly passionLevel: string;
  readonly name: string;
  readonly year: number;
}
