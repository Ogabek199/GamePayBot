import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  packageId: string;

  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsOptional()
  region?: string;
}
