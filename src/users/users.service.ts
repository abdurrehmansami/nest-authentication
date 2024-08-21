import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    private users = [
        {
            "id": 1,
            "name": "Leanne Graham",
            "email": "Sincere@april.biz",
            "role": "INTERN",
        },
        {
            "id": 2,
            "name": "Ervin Howell",
            "email": "Shanna@melissa.tv",
            "role": "INTERN",
        },
        {
            "id": 3,
            "name": "Clementine Bauch",
            "email": "Nathan@yesenia.net",
            "role": "ENGINEER",
        },
        {
            "id": 4,
            "name": "Patricia Lebsack",
            "email": "Julianne.OConner@kory.org",
            "role": "ENGINEER",
        },
        {
            "id": 5,
            "name": "Chelsey Dietrich",
            "email": "Lucio_Hettinger@annie.ca",
            "role": "ADMIN",
        }
    ]

    findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        if (role) {
            const rolesArray = this.users.filter(user => user.role === role)
            if (rolesArray.length === 0) throw new NotFoundException('User Role Not Found')
            return rolesArray
        }
        return this.users
    }

    findOne(id:number){
        const selectedUser = this.users.find(user=>user.id == id)
        if(!selectedUser){
            throw new NotFoundException('User Not Found')
        }
        return selectedUser
    }

    delete(id:number){
        const removedUser =  this.findOne(id)
        this.users=this.users.filter(user=>user.id !==id)
        return  removedUser
    }
    
    create(user:CreateUserDto){
        let maxNumber = this.users[0].id;
        for (let i = 1; i < this.users.length; i++) {
        if (this.users[i].id > maxNumber) {
            maxNumber = this.users[i].id;
        }
        }
        const userToCreate = {id:maxNumber+1, name:user.name, email:user.email,role:user.role}
        this.users.push(userToCreate)
        return user;
    }

    // updateOne(id:number, updatedUser:{ name:string,email:string, role:string}){
    //     const editUserId = id
    //     const updated = this.users.map(user=>user.id==id?{id:id,...updatedUser}:user)
    //     this.users = updated
    //     return {id:editUserId,...updatedUser}
    // }
    updateOne(id: number, updatedUser: UpdateUserDto) {
        const editUserId = id;
        const updated = this.users.map(user =>
            user.id == id ? { ...user, ...updatedUser } : user
        );
        this.users = updated;
        return { id: editUserId, ...updatedUser };
    }

}