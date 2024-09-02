import { CreateDealDto } from "./create-deal.dto";
import {PartialType} from "@nestjs/mapped-types";
export class UpdateDealDto extends PartialType(CreateDealDto) {}