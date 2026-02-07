import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PropertyDocument = Property & Document;

export enum PropertyType {
  ONE_ROOM = 'ONE_ROOM',
  TWO_ROOM = 'TWO_ROOM',
  SHARE_HOUSE = 'SHARE_HOUSE',
  OFFICETEL = 'OFFICETEL',
  APARTMENT = 'APARTMENT',
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  RENTED = 'RENTED',
  DELETED = 'DELETED',
}

export enum RentType {
  MONTHLY = 'MONTHLY',
  JEONSE = 'JEONSE',
  YEARLY = 'YEARLY',
}

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  landlord: User;

  @Prop({ type: String, enum: PropertyType, required: true })
  propertyType: PropertyType;

  @Prop({ type: String, enum: RentType, required: true })
  rentType: RentType;

  @Prop({ type: String, enum: PropertyStatus, default: PropertyStatus.AVAILABLE })
  status: PropertyStatus;

  // 주소 정보
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop()
  detailAddress: string;

  @Prop()
  postalCode: string;

  @Prop({ type: { lat: Number, lng: Number } })
  coordinates: {
    lat: number;
    lng: number;
  };

  // 가격 정보
  @Prop({ required: true })
  deposit: number; // 보증금

  @Prop({ required: true })
  monthlyRent: number; // 월세

  @Prop({ default: 0 })
  maintenanceFee: number; // 관리비

  // 매물 상세 정보
  @Prop({ required: true })
  area: number; // 평수

  @Prop({ required: true })
  roomCount: number;

  @Prop({ required: true })
  bathroomCount: number;

  @Prop()
  floor: number;

  @Prop()
  totalFloor: number;

  @Prop()
  availableFrom: Date;

  // 옵션
  @Prop({ type: [String], default: [] })
  options: string[]; // ['에어컨', '세탁기', '냉장고', '인터넷', '주차', 'CCTV' 등]

  // 이미지
  @Prop({ type: [String], default: [] })
  images: string[];

  // 추가 정보
  @Prop({ default: false })
  isPetAllowed: boolean;

  @Prop({ default: false })
  isSmokingAllowed: boolean;

  @Prop({ default: 0 })
  maxOccupants: number;

  // 통계
  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  wishlist: Types.ObjectId[]; // 찜한 사용자들

  // 인근 대학 정보
  @Prop({ type: [String], default: [] })
  nearbyUniversities: string[];

  @Prop({ type: [String], default: [] })
  nearbySubways: string[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);

// 인덱스 설정
PropertySchema.index({ landlord: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ city: 1, district: 1 });
PropertySchema.index({ deposit: 1, monthlyRent: 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ coordinates: '2dsphere' }); // 지리적 쿼리용
PropertySchema.index({ title: 'text', description: 'text' }); // 텍스트 검색용
