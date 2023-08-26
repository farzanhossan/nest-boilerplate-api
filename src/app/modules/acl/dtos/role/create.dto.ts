import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoleDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Content Manager',
  })
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;

  @IsOptional()
  @IsNumber()
  readonly createdBy!: any;
}
