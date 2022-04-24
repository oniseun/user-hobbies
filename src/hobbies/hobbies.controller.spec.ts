import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesController } from './hobbies.controller';
import { HobbiesService } from './hobbies.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { NotFoundException } from '@nestjs/common';

class MockResponse {
  res: any;
  constructor() {
    this.res = {};
  }
  status = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((code) => {
      this.res.code = code;
      return this;
    });
  send = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((message) => {
      this.res.message = message;
      return this;
    });
  json = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((json) => {
      this.res.json = json;
      return this;
    });
}

const createHobbyDto: CreateHobbyDto = {
  name: 'name #1',
  passionLevel: 'High',
  year: 2022,
  userId: 'any_user_id',
};

describe('Hobbies Controller', () => {
  let hobbiesController: HobbiesController;
  let hobbiesService: HobbiesService;
  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  const response = new MockResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HobbiesController],
      providers: [
        {
          provide: HobbiesService,
          useValue: {
            create: jest.fn(() => []),
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => {}),
            update: jest.fn(() => {}),
            remove: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    hobbiesController = module.get<HobbiesController>(
      HobbiesController,
    );
    hobbiesService =
      module.get<HobbiesService>(HobbiesService);
  });

  it('should be defined', () => {
    expect(hobbiesController).toBeDefined();
  });

  describe('getAllHobby()', () => {
    it('should call method findAll in HobbiesService', async () => {
      await hobbiesController.getAllHobbies(
        response,
        paginationQueryDto,
      );
      expect(hobbiesService.findAll).toHaveBeenCalled();
    });

    it('should throw if HobbiesService findAll throws', async () => {
      jest
        .spyOn(hobbiesService, 'findAll')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        hobbiesController.getAllHobbies(
          response,
          paginationQueryDto,
        ),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should return organization on success', async () => {
      await hobbiesController.getAllHobbies(
        response,
        paginationQueryDto,
      );
      expect(hobbiesService.findAll).toHaveBeenCalled();
    });
  });

  describe('addHobby()', () => {
    it('should call method create in HobbiesService with correct values', async () => {
      const createSpy = jest.spyOn(hobbiesService, 'create');
      await hobbiesController.addHobby(
        response,
        createHobbyDto,
      );
      expect(createSpy).toHaveBeenCalledWith(createHobbyDto);
    });

    it('should return a hobby on success', async () => {
      const createHobbySpy = jest.spyOn(hobbiesService, 'create');
      await hobbiesController.addHobby(
        response,
        createHobbyDto,
      );
      expect(createHobbySpy).toHaveBeenCalledWith(createHobbyDto);
    });
  });

  describe('deleteHobby()', () => {
    it('should call method remove in HobbiesService with correct value', async () => {
      const deleteSpy = jest.spyOn(hobbiesService, 'remove');
      await hobbiesController.deleteHobby(response, 'anyid');
      expect(deleteSpy).toHaveBeenCalledWith('anyid');
    });

    it('should throw error if id in HobbiesService not exists', async () => {
      jest
        .spyOn(hobbiesService, 'remove')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        hobbiesController.deleteHobby(response, 'anyid'),
      ).rejects.toThrow(new NotFoundException());
    });
  });
});
