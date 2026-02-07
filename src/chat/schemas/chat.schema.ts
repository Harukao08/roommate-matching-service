import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ChatRoomDocument = ChatRoom & Document;
export type MessageDocument = Message & Document;

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop()
  fileUrl: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  readBy: Types.ObjectId[]; // 읽은 사용자들

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage: Types.ObjectId;

  @Prop()
  lastMessageAt: Date;

  // 매물 관련 채팅인 경우
  @Prop({ type: Types.ObjectId, ref: 'Property' })
  property: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  // 각 참여자별 읽지 않은 메시지 수
  @Prop({ type: Map, of: Number, default: {} })
  unreadCount: Map<string, number>;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

// 인덱스 설정
ChatRoomSchema.index({ participants: 1 });
ChatRoomSchema.index({ property: 1 });
ChatRoomSchema.index({ lastMessageAt: -1 });
ChatRoomSchema.index({ isActive: 1 });
