import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateDepositStatusDto {
  @IsString()
  @IsIn(['approved', 'rejected'])
  status: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  reason?: string;
}
