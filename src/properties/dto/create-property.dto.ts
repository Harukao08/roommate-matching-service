import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDate,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, RentType } from '../schemas/property.schema';

class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsEnum(RentType)
  rentType: RentType;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  detailAddress?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @IsNumber()
  @Min(0)
  deposit: number;

  @IsNumber()
  @Min(0)
  monthlyRent: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maintenanceFee?: number;

  @IsNumber()
  @Min(0)
  area: number;

  @IsNumber()
  @Min(1)
  roomCount: number;

  @IsNumber()
  @Min(1)
  bathroomCount: number;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsNumber()
  totalFloor?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  availableFrom?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isPetAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  isSmokingAllowed?: boolean;

  @IsOptional()
  @IsNumber()
  maxOccupants?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nearbyUniversities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nearbySubways?: string[];
}
