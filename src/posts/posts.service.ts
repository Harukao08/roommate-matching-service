import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, PostStatus } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: any, authorId: string): Promise<Post> {
    const createdPost = new this.postModel({
      ...createPostDto,
      author: authorId,
    });
    return createdPost.save();
  }

  async findAll(page = 1, limit = 20, category?: string): Promise<{ posts: Post[]; total: number }> {
    const query: any = { status: PostStatus.ACTIVE };
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postModel
        .find(query)
        .populate('author', 'name profileImage university')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(query).exec(),
    ]);

    return { posts, total };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'name profileImage university')
      .exec();

    if (!post || post.status === PostStatus.DELETED) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.postModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return post;
  }

  async update(id: string, updatePostDto: any, userId: string): Promise<Post> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await this.postModel.findByIdAndUpdate(id, { status: PostStatus.DELETED });
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const likeIndex = post.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId as any);
    }

    return post.save();
  }
}
