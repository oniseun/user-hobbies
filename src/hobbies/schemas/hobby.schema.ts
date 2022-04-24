import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Hobby extends Document {
  @Prop()
  passionLevel: string;

  @Prop()
  name: string;

  @Prop()
  year: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: string;
}

export const HobbySchema = SchemaFactory.createForClass(Hobby).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
