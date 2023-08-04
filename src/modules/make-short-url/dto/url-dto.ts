import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UrlDTO {
  @ApiProperty()
  @IsString()
  url: string;
}
