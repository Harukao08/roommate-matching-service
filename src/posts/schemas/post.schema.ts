import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

export enum PostCategory {
  FIND_ROOMMATE = 'FIND_ROOMMATE',
  FIND_ROOM = 'FIND_ROOM',
  TIPS = 'TIPS',
  QUESTIONS = 'QUESTIONS',
  GENERAL = 'GENERAL',
}

export enum PostStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DELETED = 'DELETED',
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: String, enum: PostCategory, required: true })
  category: PostCategory;

  @Prop({ type: String, enum: PostStatus, default: PostStatus.ACTIVE })
  status: PostStatus;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: 0 })
  commentCount: number;

  // 룸메이트 찾기 관련 추가 정보
  @Prop()
  preferredGender: string;

  @Prop()
  budget: number;

  @Prop()
  moveInDate: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// 인덱스 설정
PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ title: 'text', content: 'text' }); // 텍스트 검색용
