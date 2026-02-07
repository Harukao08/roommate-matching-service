import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PropertyStatus } from '../schemas/property.schema';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}
