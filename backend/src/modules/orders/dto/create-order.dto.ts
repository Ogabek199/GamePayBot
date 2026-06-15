import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  packageId: string;

  @IsString()
  @IsNotEmpty()
  uid: string; // game user id

  @IsString()
  @IsOptional()
  region?: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  currency?: string;
}
