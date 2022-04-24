import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @Length(4, 30)
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

}

