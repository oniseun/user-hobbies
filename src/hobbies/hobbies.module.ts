import { Module } from '@nestjs/common';
import { HobbiesController } from './hobbies.controller';
import { HobbiesService } from './hobbies.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HobbySchema,
  Hobby,
} from './schemas/hobby.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hobby.name, schema: HobbySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [HobbiesController],
  providers: [HobbiesService],
})
export class HobbiesModule {}
