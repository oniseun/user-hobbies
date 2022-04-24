import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IHobby } from './interfaces/hobby.interface';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { Hobby } from './schemas/hobby.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { User } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class HobbiesService {
  constructor(
    @InjectModel(Hobby.name) private readonly hobbyModel: Model<Hobby>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  public async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<Hobby[]> {
    const { limit, offset } = paginationQuery;
    return await this.hobbyModel
      .find()
      .skip(offset)
      .limit(limit)
      .populate('userId',{ _id: 1, name: 1})
      .exec();
  }

  public async create(
    createHobbyDto: CreateHobbyDto,
  ): Promise<IHobby | BadRequestException> {
    const user = await this.userModel.findOne({_id: createHobbyDto.userId})
    console.log({user})
    if (!user) {
        throw new NotFoundException(`user #${createHobbyDto.userId} not found`);
    }

    try {
      const hobby = await this.hobbyModel.create(
        createHobbyDto,
      );
  
      if (hobby) {
        user.hobbies.push(hobby._id);
        await user.save()
      }
  
      return hobby;

    } catch (e) {
      console.error(e)
      throw new BadRequestException(`Error: hobby could not be created`, e);
  }
}

  public async remove(hobbyId: string): Promise<IHobby | BadRequestException> {

    try {
      const hobby = await this.hobbyModel.findOneAndDelete(
        { _id :hobbyId}
      );
      await this.userModel.findByIdAndUpdate(hobby.userId, { $pull: { hobbies: hobbyId} }, {new: true} );
      return hobby;
    } catch (e) {
      console.error(e)
      throw new BadRequestException(`Error: hobby could not be deleted`, e);
    }
  }
}
