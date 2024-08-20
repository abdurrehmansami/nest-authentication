import { CreateUserDto } from "./create-user.dto";
import {PartialType} from "@nestjs/mapped-types";
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// When building input validation types (also called DTOs), it's often useful to build create and update variations on the same type. For example, the create variant may require all fields, while the update variant may make all fields optional.

// Nest provides the PartialType() utility function to make this task easier and minimize boilerplate.

// The PartialType() function returns a type (class) with all the properties of the input type set to optional. For example, suppose we have a create type 