import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom, ChatRoomDocument, Message, MessageType } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  async createRoom(participants: string[], propertyId?: string): Promise<ChatRoom> {
    // 이미 같은 참여자들의 방이 있는지 확인
    const existingRoom = await this.chatRoomModel.findOne({
      participants: { $all: participants, $size: participants.length },
      property: propertyId || null,
    });

    if (existingRoom) {
      return existingRoom;
    }

    const chatRoom = new this.chatRoomModel({
      participants,
      property: propertyId,
      messages: [],
      unreadCount: {},
    });

    return chatRoom.save();
  }

  async getRooms(userId: string): Promise<ChatRoom[]> {
    return this.chatRoomModel
      .find({ participants: userId, isActive: true })
      .populate('participants', 'name profileImage')
      .populate('property', 'title address images')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async getRoom(roomId: string, userId: string): Promise<ChatRoom> {
    const room = await this.chatRoomModel
      .findById(roomId)
      .populate('participants', 'name profileImage')
      .populate('property', 'title address images')
      .exec();

    if (!room) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }

    // 참여자 확인
    const isParticipant = room.participants.some(
      (p: any) => p._id.toString() === userId,
    );

    if (!isParticipant) {
      throw new ForbiddenException('채팅방에 접근할 수 없습니다.');
    }

    return room;
  }

  async createMessage(
    roomId: string,
    senderId: string,
    content: string,
    type: string = MessageType.TEXT,
  ): Promise<Message> {
    const room = await this.chatRoomModel.findById(roomId);

    if (!room) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }

    const message: Message = {
      sender: senderId as any,
      content,
      type: type as MessageType,
      readBy: [senderId as any],
      isDeleted: false,
    } as Message;

    room.messages.push(message);
    room.lastMessageAt = new Date();

    // 다른 참여자들의 unread count 증가
    room.participants.forEach((participantId: any) => {
      if (participantId.toString() !== senderId) {
        const currentCount = room.unreadCount.get(participantId.toString()) || 0;
        room.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await room.save();

    return room.messages[room.messages.length - 1];
  }

  async getMessages(roomId: string, userId: string, page = 1, limit = 50): Promise<Message[]> {
    const room = await this.getRoom(roomId, userId);

    const skip = (page - 1) * limit;
    const messages = room.messages
      .slice(-skip - limit, room.messages.length - skip)
      .reverse();

    return messages;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const room = await this.chatRoomModel.findOne({
      'messages._id': messageId,
    });

    if (!room) {
      throw new NotFoundException('메시지를 찾을 수 없습니다.');
    }

    const message = room.messages.find((m: any) => m._id.toString() === messageId);
    if (message && !message.readBy.includes(userId as any)) {
      message.readBy.push(userId as any);

      // unread count 감소
      const currentCount = room.unreadCount.get(userId) || 0;
      if (currentCount > 0) {
        room.unreadCount.set(userId, currentCount - 1);
      }

      await room.save();
    }
  }

  async markAllAsRead(roomId: string, userId: string): Promise<void> {
    const room = await this.chatRoomModel.findById(roomId);

    if (!room) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }

    room.messages.forEach((message: any) => {
      if (!message.readBy.includes(userId as any)) {
        message.readBy.push(userId as any);
      }
    });

    room.unreadCount.set(userId, 0);
    await room.save();
  }

  async deleteRoom(roomId: string, userId: string): Promise<void> {
    const room = await this.chatRoomModel.findById(roomId);

    if (!room) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }

    // 참여자 확인
    const isParticipant = room.participants.some(
      (p: any) => p.toString() === userId,
    );

    if (!isParticipant) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    room.isActive = false;
    await room.save();
  }
}
