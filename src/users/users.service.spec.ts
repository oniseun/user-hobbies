import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';

const mockUser: any = {
  name: 'firstName #1',
};

const mockUserUpdate: any = {
  _id: 'anyid',
  name: 'firstName update',
};

const usersArray = [
  {
    _id: 'anyid',
    name: 'firstName #1',
  },
  {
    _id: 'anyid',
    name: 'firstName #2',
  },
];

const createUserDto: CreateUserDto = {
  name: 'firstName #1',
};

const updateUserDto: UpdateUserDto = {
  name: 'firstName update',
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<IUser>;

  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn().mockReturnValue(usersArray),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(createUserDto),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<IUser>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(usersArray),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const users = await service.findAll(paginationQueryDto);
      expect(users).toEqual(usersArray);
    });
  });

  describe('findOne()', () => {
    it('should return one user', async () => {
      const findSpy = jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const response = await service.findOne('anyid');
      expect(findSpy).toHaveBeenCalledWith({ _id: 'anyid' });
      expect(response).toEqual(mockUser);
    });

    it('should throw if find one user throws', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn(() => null),
        populate: jest.fn().mockReturnThis(),
      } as any);
      await expect(service.findOne('anyid')).rejects.toThrow(
        new NotFoundException('User #anyid not found'),
      );
    });
  });

  describe('create()', () => {
    it('should insert a new user', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'a id',
          name: 'firstName #1',
          hobbies: []
        }),
      );
      const newUser = await service.create({
        name: 'firstName #1',
      });
      expect(newUser).toEqual({
        _id: 'a id',
        name: 'firstName #1',
        hobbies: [],
      });
    });
  });

  describe('update()', () => {
    it('should call UserSchema update with correct values', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce({
        _id: 'anyid',
        updateUserDto,
        new: true,
      } as any);

      const updateUser = await service.update('anyid', updateUserDto);
      expect(updateUser).toEqual({
        ...mockUserUpdate,
        new: true,
      });
    });

    it('should throw if UserSchema throws', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new NotFoundException('User #anyid not found'),
        );
      await expect(service.update('anyid', updateUserDto)).rejects.toThrow(
        new NotFoundException('User #anyid not found'),
      );
    });
  });

  describe('remove()', () => {
    it('should call UserSchema remove with correct value', async () => {
      const removeSpy = jest.spyOn(model, 'findByIdAndRemove');
      const retVal = await service.remove('any id');
      expect(removeSpy).toBeCalledWith('any id');
      expect(retVal).toBeUndefined();
    });

    it('should throw if UserSchema remove throws', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(service.remove('anyid')).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });
});
