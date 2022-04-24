import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesService } from './hobbies.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IHobby } from './interfaces/hobby.interface';

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
  let model: Model<IHobby>;

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
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockHobby),
            constructor: jest.fn().mockResolvedValue(mockHobby),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            offset: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HobbiesService>(HobbiesService);
    model = module.get<Model<IHobby>>(getModelToken('Hobby'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all hobbies', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
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
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'a id',
          name: 'name #1',
          passionLevel: 'High',
          year: 2022,
          userId: 'any_user_id',
        }),
      );
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
      const removeSpy = jest.spyOn(model, 'findByIdAndRemove');
      const retVal = await service.remove('any id');
      expect(removeSpy).toBeCalledWith('any id');
      expect(retVal).toBeUndefined();
    });

    it('should throw if HobbySchema remove throws', async () => {
      jest
        .spyOn(model, 'findByIdAndRemove')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(service.remove('anyid')).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });
});
