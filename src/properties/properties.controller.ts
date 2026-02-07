import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto, @Request() req) {
    return this.propertiesService.create(createPropertyDto, req.user.userId);
  }

  @Public()
  @Get()
  findAll(@Query() filterDto: FilterPropertyDto) {
    return this.propertiesService.findAll(filterDto);
  }

  @Public()
  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.propertiesService.searchByText(searchTerm);
  }

  @Get('my')
  getMyProperties(@Request() req) {
    return this.propertiesService.getMyProperties(req.user.userId);
  }

  @Get('wishlist')
  getWishlist(@Request() req) {
    return this.propertiesService.getWishlist(req.user.userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Request() req,
  ) {
    return this.propertiesService.update(id, updatePropertyDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.propertiesService.remove(id, req.user.userId);
  }

  @Post(':id/wishlist')
  toggleWishlist(@Param('id') id: string, @Request() req) {
    return this.propertiesService.toggleWishlist(id, req.user.userId);
  }
}
