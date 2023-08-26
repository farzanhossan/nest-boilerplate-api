import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateRolesDTO {
  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly role!: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isDeleted!: boolean;
}

export class UpdateUserDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Zahid',
  })
  @IsOptional()
  @IsString()
  readonly firstName!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Hasan',
  })
  @IsOptional()
  @IsString()
  readonly lastName!: string;

  //   @ApiProperty({
  //     type: String,
  //     required: false,
  //     example: 'zahid@gmail.com',
  //   })
  //   @IsOptional()
  //   @IsEmail()
  //   readonly email!: string;

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
    type: [UpdateRolesDTO],
    required: false,
    example: [
      {
        role: 1,
      },
      {
        role: 2,
        isDeleted: true,
      },
    ],
  })
  @ValidateNested()
  @Type(() => UpdateRolesDTO)
  @IsOptional()
  readonly roles!: UpdateRolesDTO[];

  @IsOptional()
  @IsNumber()
  readonly updatedBy!: any;
}
