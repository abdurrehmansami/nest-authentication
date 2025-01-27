import { IsString, IsUrl } from "class-validator";

export class CreateMediaDto {
//   @IsUrl()
//   url: string;

  @IsString()
  title: string;

  name: string;

  mimetype: string;

  path: string;
}