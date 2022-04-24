import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesService } from './hobbies.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IHobby } from './interfaces/hobby.interface';
import { IUser } from '../users/interfaces/user.interface';

const mockHobby: any = {
  _id: 'anyid',
  name: 'name #1',
  passionLevel: 'High',
  year: 2022,
  userId: 'any_user_id',
};

const hobbiesArray = [
  {
    _id: 'anyid',
    name: 'name #1',
    passionLevel: 'High',
    year: 2022,
    userId: 'any_user_id',
  },
  {
    _id: 'anyid1',
    name: 'name #2',
    passionLevel: 'High',
    year: 2022,
    userId: 'any_user_id',
  },
];

const createHobbyDto: CreateHobbyDto = {
  name: 'name #1',
  passionLevel: 'High',
  year: 2022,
  userId: 'any_user_id',
};


describe('HobbiesService', () => {
  let service: HobbiesService;
  let hobbyModel: Model<IHobby>;
  let userModel: Model<IUser>

  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  const hobbiesList = [
    {
      _id: 'anyid',
      name: 'name #1',
      passionLevel: 'High',
      year: 2022,
      userId: 'any_user_id',
    },
    {
      _id: 'anyid1',
      name: 'name #2',
      passionLevel: 'High',
      year: 2022,
      userId: 'any_user_id',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HobbiesService,
        {
          provide: getModelToken('Hobby'),
          useValue: {
            find: jest.fn().mockReturnValue(hobbiesList),
            skip: jest.fn(),
            limit: jest.fn(),
            populate: jest.fn(),
            exec: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HobbiesService>(HobbiesService);
    hobbyModel = module.get<Model<IHobby>>(getModelToken('Hobby'));
    userModel = module.get<Model<IUser>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all hobbies', async () => {
      jest.spyOn(hobbyModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(hobbiesArray),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const hobbies = await service.findAll(paginationQueryDto);
      expect(hobbies).toEqual(hobbiesArray);
    });
  });

  describe('create()', () => {
    it('should insert a new hobby', async () => {
      jest.spyOn(hobbyModel, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'a id',
          name: 'name #1',
          passionLevel: 'High',
          year: 2022,
          userId: 'any_user_id',
        }),
      );

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        _id: 'any_user_id',
        name: 'firstName #2',
        hobbies: [],
        save: jest.fn()
      } as any);
      const newHobby: IHobby | BadRequestException = await service.create(createHobbyDto);
      expect(newHobby).toEqual({
        _id: 'a id',
        name: 'name #1',
        passionLevel: 'High',
        year: 2022,
        userId: 'any_user_id',
      });
    });
  });

  describe('remove()', () => {
    it('should call HobbySchema remove with correct value', async () => {
      const removeSpy = jest.spyOn(hobbyModel, 'findOneAndDelete').mockResolvedValueOnce(
        {
          userId: "xyzuserid"
        } as any
      )
      jest.spyOn(userModel, 'findByIdAndUpdate').mockImplementationOnce(jest.fn());
      const retVal = await service.remove('any id');
      expect(removeSpy).toBeCalledWith({ _id : "any id" });
      expect(retVal).toStrictEqual({
        userId: "xyzuserid"
      });
    });

    it('should throw if HobbySchema remove throws', async () => {

      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new BadRequestException());
      await expect(service.remove('anyid')).rejects.toThrow(
        new BadRequestException(),
      );
    });

  });
});
