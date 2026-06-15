import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class CreateDepositDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  cardId: string;
}
