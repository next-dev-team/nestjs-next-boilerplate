import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class SubAuth {
  @IsNotEmpty()
  fullName!: string;
}

export class CreateAuthDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;

  @ValidateNested({ each: true })
  @Type(() => SubAuth)
  profile!: SubAuth[];
}
