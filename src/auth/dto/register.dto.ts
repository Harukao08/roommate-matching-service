import { IsEmail, IsString, MinLength, IsEnum, IsPhoneNumber, IsOptional } from 'class-validator';
import { UserRole, Gender } from '../../users/schemas/user.schema';

export class RegisterDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  university: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
