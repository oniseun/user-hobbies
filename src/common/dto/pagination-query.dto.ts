import { IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional()
  limit: number;

  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional()
  offset: number;
}
