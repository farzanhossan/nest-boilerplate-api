import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateRolesDTO {
  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly role!: number;
}
export class CreateUserDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Zahid',
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Hasan',
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'username/email/phonenumber',
  })
  @IsNotEmpty()
  readonly identifier!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly password!: string;

  @ApiProperty({
    type: [CreateRolesDTO],
    required: false,
    example: [
      {
        role: 1,
      },
      {
        role: 2,
      },
    ],
  })
  @ValidateNested()
  @Type(() => CreateRolesDTO)
  @IsOptional()
  readonly roles!: CreateRolesDTO[];

  @IsOptional()
  @IsNumber()
  readonly createdBy!: any;
}
