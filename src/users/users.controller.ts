import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all users and hobbies populated' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Gets all users and hobbies populated' })
  public async getAllUsers(
    @Res() res,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const users = await this.usersService.findAll(paginationQuery);
    return res.status(HttpStatus.OK).json(users);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Gets single user by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns new user details' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error: Invalid User ID supplied' })
  public async getUser(@Res() res, @Param('id') userId: string) {
    try {
      const user = await this.usersService.findOne(userId);
      return res.status(HttpStatus.OK).json(user);

    } catch(e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Invalid User ID supplied'
      });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Creates new user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns newly created user details' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error: Invalid User ID supplied' })
  public async addUser(
    @Res() res,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.OK).json({
        message: 'User has been created successfully',
        user,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not created!'
      });
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Updates user by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User has been successfully updated' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error: Invalid User ID supplied' })
  public async updateUser(
    @Res() res,
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(
        userId,
        updateUserDto,
      );
      return res.status(HttpStatus.OK).json({
        message: 'User has been successfully updated',
        user,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not updated!'
      });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deletes user by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User has been deleted' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error: User could not be deleted!' })
  public async deleteUser(@Res() res, @Param('id') userId: string) {

    try {
      const user = await this.usersService.remove(userId);
      return res.status(HttpStatus.OK).json({
        message: 'User has been deleted',
        user,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User could not be deleted!'
      });
    }

  }
}
