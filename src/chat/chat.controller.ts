import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  createRoom(
    @Body() body: { participants: string[]; propertyId?: string },
    @Request() req,
  ) {
    // 현재 사용자를 참여자에 포함
    if (!body.participants.includes(req.user.userId)) {
      body.participants.push(req.user.userId);
    }
    return this.chatService.createRoom(body.participants, body.propertyId);
  }

  @Get('rooms')
  getRooms(@Request() req) {
    return this.chatService.getRooms(req.user.userId);
  }

  @Get('rooms/:id')
  getRoom(@Param('id') id: string, @Request() req) {
    return this.chatService.getRoom(id, req.user.userId);
  }

  @Get('rooms/:id/messages')
  getMessages(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Request() req,
  ) {
    return this.chatService.getMessages(id, req.user.userId, page, limit);
  }

  @Post('rooms/:id/read')
  markAllAsRead(@Param('id') id: string, @Request() req) {
    return this.chatService.markAllAsRead(id, req.user.userId);
  }

  @Delete('rooms/:id')
  deleteRoom(@Param('id') id: string, @Request() req) {
    return this.chatService.deleteRoom(id, req.user.userId);
  }
}
