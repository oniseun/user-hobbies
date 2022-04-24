import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

const mockUser: any = {
  _id: 'anyid',
  name: 'firstName#1',
  organizations: [],
};

const createUserDto: CreateUserDto = {
  name: 'firstName#1',
};

const updateUserDto: UpdateUserDto = {
  name : 'firstName update',
};

describe('Users Controller', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  const response = new MockResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getAllUser()', () => {
    it('should call method findAll in UsersService', async () => {
      await usersController.getAllUsers(response, paginationQueryDto);
      expect(usersService.findAll).toHaveBeenCalled();
    });

    it('should throw if UsersService findAll throws', async () => {
      jest
        .spyOn(usersService, 'findAll')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        usersController.getAllUsers(response, paginationQueryDto),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should return user on success', async () => {
      await usersController.getAllUsers(response, paginationQueryDto);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('getUser()', () => {
    it('should call method findOne in UsersService with correct value', async () => {
      const findSpy = jest.spyOn(usersService, 'findOne');
      await usersController.getUser(response, 'anyid');
      expect(findSpy).toHaveBeenCalledWith('anyid');
    });

    it('should throw if UsersService findOne throws', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        usersController.getUser(response, 'anyid'),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should return a user on success', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValueOnce(mockUser);
      await usersController.getUser(response, 'anyid');
      expect(usersService.findOne).toHaveBeenCalled();
    });
  });

  describe('addUser()', () => {
    it('should call method create in UsersService with correct values', async () => {
      const createSpy = jest.spyOn(usersService, 'create');
      await usersController.addUser(response, createUserDto);
      expect(createSpy).toHaveBeenCalledWith(createUserDto);
    });

    it('should return a user on success', async () => {
      const createUserSpy = jest.spyOn(usersService, 'create');
      await usersController.addUser(response, createUserDto);
      expect(createUserSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser()', () => {
    it('should call method update in UsersService with correct values', async () => {
      const updateSpy = jest.spyOn(usersService, 'update');
      await usersController.updateUser(
        response,
        'anyid',
        updateUserDto,
      );
      expect(updateSpy).toHaveBeenCalledWith('anyid', updateUserDto);
    });
  });

  describe('deleteUser()', () => {
    it('should call method remove() in UsersService with correct value', async () => {
      const deleteSpy = jest.spyOn(usersService, 'remove');
      await usersController.deleteUser(response, 'anyid');
      expect(deleteSpy).toHaveBeenCalledWith('anyid');
    });

    it('should throw error if id in UsersService not exists', async () => {
      jest
        .spyOn(usersService, 'remove')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        usersController.deleteUser(response, 'anyid'),
      ).rejects.toThrow(new NotFoundException());
    });
  });
});
