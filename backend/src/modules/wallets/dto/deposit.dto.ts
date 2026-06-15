import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class DepositDto {
  @IsUUID()
  walletId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsOptional()
  meta?: any;
}
