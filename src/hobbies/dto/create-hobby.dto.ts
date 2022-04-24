import { IsNotEmpty, IsString, IsMongoId, Length, IsIn, Min, Max, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const PassionLevel : string[] = ['Medium', 'High' , 'Low', 'Very-High']

export class CreateHobbyDto {
  @IsString()
  @IsIn(PassionLevel)
  @IsNotEmpty()
  @ApiProperty()
  readonly passionLevel: string;

  @IsString()
  @Length(4, 30)
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsNumber()
  @Min(new Date().getFullYear() - 200)
  @Max(new Date().getFullYear())
  @IsNotEmpty()
  @ApiProperty()
  readonly year: number;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly userId: string;
}
