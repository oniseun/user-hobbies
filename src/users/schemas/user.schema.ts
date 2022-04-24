import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'Hobby' })
  hobbies: string[];
}

export const UserSchema = SchemaFactory.createForClass(User).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
