import { Controller, Post, Body, UnauthorizedException, Get, Headers, Param, Patch, Query, Delete, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users') // /users
export class UsersController {

    constructor(private readonly userService: UsersService) { }
    // without sevices
    /*
    Get users
    Get /users/:id
    Post /users
    patch /users/:id
    delete /users/:id
    */

    @Get()  //  /users or /user?role=value
    findAll(@Query('role') role?:'INTERN' | 'ENGINEER' | 'ADMIN') {
        return this.userService.findAll(role)
    }
    @Get(':id') //  /users/id  
    findOne(@Param('id', ParseIntPipe) id: number) {
        console.log('params api');
        return this.userService.findOne(id)
    }
    // @Get(':id') // /users/id
    // findParam(@Param() params: any): string {
    // console.log(params.id);
    // return `This action returns a #${params.id} cat`;
    // }


    @Post() //  /users;'';;


    createOne(@Body(ValidationPipe) user:CreateUserDto) {
        return this.userService.create(user);
    }
    @Patch(':id') //  /users/id  
    updateOne(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updatedUser: UpdateUserDto) {
        return this.userService.updateOne(id,updatedUser)
    }
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id)  
    }
}
