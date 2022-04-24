import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { HobbiesService } from './hobbies.service';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('hobbies')
@Controller('hobbies')
export class HobbiesController {
  constructor(private readonly hobbiesService: HobbiesService) {}
  

  @Get()
  @ApiOperation({ summary: 'Gets all hobbies' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of hobbies' })
  public async getAllHobbies(
    @Res() res,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const hobbies = await this.hobbiesService.findAll(
      paginationQuery,
    );
    return res.status(HttpStatus.OK).json(hobbies);
  }

  @Post()
  @ApiOperation({ summary: 'creates new hobby for userid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'hobby has been created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error: Hobby not created!' })
  public async addHobby(
    @Res() res,
    @Body() createHobbyDto: CreateHobbyDto,
  ) {
    try {
      const hobby = await this.hobbiesService.create(
        createHobbyDto,
      );
      return res.status(HttpStatus.OK).json({
        message: 'hobby has been created successfully',
        hobby,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Hobby not created!',
      });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'deletes hobby by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'hobby has been deleted successfully!' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error: Hobby could not be deleted!' })
  public async deleteHobby(
    @Res() res,
    @Param('id') hobbyId: string,
  ) {
    try {
      const hobby = await this.hobbiesService.remove(hobbyId);

      return res.status(HttpStatus.OK).json({
        message: 'hobby has been deleted successfully!',
        hobby,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Hobby could not be deleted!',
      });
    }
    
  }
}
