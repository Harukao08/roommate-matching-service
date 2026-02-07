import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument, PropertyStatus } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, landlordId: string): Promise<Property> {
    const createdProperty = new this.propertyModel({
      ...createPropertyDto,
      landlord: landlordId,
    });
    return createdProperty.save();
  }

  async findAll(filterDto: FilterPropertyDto): Promise<{ properties: Property[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      city,
      district,
      propertyType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    const query: any = { status: PropertyStatus.AVAILABLE };

    if (city) query.city = city;
    if (district) query.district = district;
    if (propertyType) query.propertyType = propertyType;
    if (minPrice !== undefined) query.monthlyRent = { ...query.monthlyRent, $gte: minPrice };
    if (maxPrice !== undefined) query.monthlyRent = { ...query.monthlyRent, $lte: maxPrice };
    if (minArea !== undefined) query.area = { ...query.area, $gte: minArea };
    if (maxArea !== undefined) query.area = { ...query.area, $lte: maxArea };

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find(query)
        .populate('landlord', 'name phoneNumber')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.propertyModel.countDocuments(query).exec(),
    ]);

    return { properties, total };
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyModel
      .findById(id)
      .populate('landlord', 'name phoneNumber email')
      .exec();

    if (!property) {
      throw new NotFoundException('매물을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.propertyModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, userId: string): Promise<Property> {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException('매물을 찾을 수 없습니다.');
    }

    // 소유자 확인
    if (property.landlord.toString() !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    const updatedProperty = await this.propertyModel
      .findByIdAndUpdate(id, updatePropertyDto, { new: true })
      .exec();

    return updatedProperty;
  }

  async remove(id: string, userId: string): Promise<void> {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException('매물을 찾을 수 없습니다.');
    }

    // 소유자 확인
    if (property.landlord.toString() !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    // Soft delete
    await this.propertyModel.findByIdAndUpdate(id, { status: PropertyStatus.DELETED });
  }

  async toggleWishlist(propertyId: string, userId: string): Promise<Property> {
    const property = await this.propertyModel.findById(propertyId);

    if (!property) {
      throw new NotFoundException('매물을 찾을 수 없습니다.');
    }

    const wishlistIndex = property.wishlist.findIndex(
      (id) => id.toString() === userId,
    );

    if (wishlistIndex > -1) {
      // 이미 찜한 경우 제거
      property.wishlist.splice(wishlistIndex, 1);
    } else {
      // 찜 추가
      property.wishlist.push(userId as any);
    }

    return property.save();
  }

  async getMyProperties(userId: string): Promise<Property[]> {
    return this.propertyModel
      .find({ landlord: userId, status: { $ne: PropertyStatus.DELETED } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getWishlist(userId: string): Promise<Property[]> {
    return this.propertyModel
      .find({ wishlist: userId, status: PropertyStatus.AVAILABLE })
      .sort({ createdAt: -1 })
      .exec();
  }

  async searchByText(searchTerm: string): Promise<Property[]> {
    return this.propertyModel
      .find(
        {
          $text: { $search: searchTerm },
          status: PropertyStatus.AVAILABLE,
        },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .exec();
  }
}
