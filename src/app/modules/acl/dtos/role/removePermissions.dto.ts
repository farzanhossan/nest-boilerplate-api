import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyArray, IsNumberArray } from '@src/app/decorators';

export class RemovePermissionsDTO {
  @ApiProperty({
    type: [Number],
    required: true,
    example: [1, 2],
  })
  @IsNotEmptyArray()
  @IsNumberArray()
  permissions!: number[];
}
