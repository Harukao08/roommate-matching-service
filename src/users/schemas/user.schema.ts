import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  STUDENT = 'STUDENT',
  LANDLORD = 'LANDLORD',
  ADMIN = 'ADMIN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum LifestylePattern {
  EARLY_BIRD = 'EARLY_BIRD',
  NIGHT_OWL = 'NIGHT_OWL',
  FLEXIBLE = 'FLEXIBLE',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  // 대학 정보
  @Prop({ required: true })
  university: string;

  @Prop()
  studentId: string;

  @Prop({ default: false })
  isVerified: boolean;

  // 프로필 정보
  @Prop()
  profileImage: string;

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  bio: string;

  @Prop({ default: false })
  isSmoker: boolean;

  @Prop({ default: false })
  hasPet: false;

  @Prop({ type: String, enum: LifestylePattern })
  lifestylePattern: LifestylePattern;

  @Prop({ type: [String], default: [] })
  interests: string[];

  // 알림 설정
  @Prop({ default: true })
  emailNotification: boolean;

  @Prop({ default: true })
  pushNotification: boolean;

  // Refresh Token
  @Prop()
  refreshToken: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 인덱스 설정
UserSchema.index({ email: 1 });
UserSchema.index({ university: 1 });
UserSchema.index({ isVerified: 1 });
