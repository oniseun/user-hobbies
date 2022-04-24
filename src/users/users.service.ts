import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './schemas/user.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Hobby } from 'src/hobbies/schemas/hobby.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    @InjectModel(Hobby.name) private readonly hobbyModel: Model<Hobby>,
  ) {}

  public async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<IUser[]> {
    const { limit, offset } = paginationQuery;

    return await this.userModel
      .find()
      .skip(offset)
      .limit(limit)
      .populate('hobbies',{ _id: 1, name: 1, passionLevel: 1, year: 1})
      .exec();
  }

  public async findOne(userId: string): Promise<IUser> {
    const user = await this.userModel
      .findById({ _id: userId })
      .populate('hobbies', { _id: 1, name: 1, passionLevel: 1, year: 1})
      .exec();

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<IUser | BadRequestException> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (e) {
      console.error('User:create:', e)
      throw new BadRequestException(`Error creating User`);
    }
  }

  public async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser | NotFoundException> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      { _id: userId },
      updateUserDto,
    );

    if (!existingUser) {
      console.error('User:update:', existingUser)
      throw new NotFoundException(`User #${userId} not found`);
    }

    return existingUser;
  }

  public async remove(userId: string): Promise<IUser | BadRequestException> {

    try {
      const deletedUser = await this.userModel.findByIdAndRemove(
        userId,
      ); 
      await this.hobbyModel.deleteMany({ _id: { $in : deletedUser.hobbies } })
      return deletedUser;

    } catch (e) {
      console.error('User:remove:', e)
      throw new BadRequestException(`Error: user could not be deleted`, e);
    }
 
  }
}
