import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Property } from '../../properties/schemas/property.schema';

export type ReservationDocument = Reservation & Document;

export enum ReservationStatus {
  PENDING = 'PENDING', // 대기
  APPROVED = 'APPROVED', // 승인
  REJECTED = 'REJECTED', // 거절
  CANCELLED = 'CANCELLED', // 취소
  COMPLETED = 'COMPLETED', // 완료
}

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  property: Property;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tenant: User;

  @Prop({ type: String, enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  // 예약 기간
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  // 예약자 정보
  @Prop({ required: true })
  tenantName: string;

  @Prop({ required: true })
  tenantPhone: string;

  @Prop()
  message: string; // 집주인에게 전달할 메시지

  // 결제 정보
  @Prop({ default: 0 })
  reservationFee: number; // 예약금

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  payment: Types.ObjectId;

  // 상태 변경 이력
  @Prop()
  approvedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  cancelledAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop()
  cancellationReason: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

// 인덱스 설정
ReservationSchema.index({ property: 1 });
ReservationSchema.index({ tenant: 1 });
ReservationSchema.index({ status: 1 });
ReservationSchema.index({ startDate: 1, endDate: 1 });
ReservationSchema.index({ createdAt: -1 });
