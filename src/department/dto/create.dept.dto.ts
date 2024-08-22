import { IsNotEmpty } from 'class-validator';

export class CreateDeptDto {
  @IsNotEmpty()
  name: string;

}
