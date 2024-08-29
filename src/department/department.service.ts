import { Injectable,ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Department } from './entities/department.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  
  // async createDepartment(name: string): Promise<Department> {
    
  //   const alreadyExist = await this.departmentRepository.findOne({
  //       where: {name:name}
  //   })
  //   if(alreadyExist){
  //       throw new ConflictException('Department Already Exist')
  //     }
  //   const department = this.departmentRepository.create({ name });
  //   return this.departmentRepository.save(department);
  // }
  async createDepartment(name: string): Promise<Department> {
    return await this.dataSource.transaction(async manager => {
      const alreadyExist = await manager.findOne(Department, { where: { name } });

      if (alreadyExist) {
        throw new ConflictException('Department Already Exists');
      }

      const department = manager.create(Department, { name });
      return manager.save(department);
    });
  }

  // async assignUserToDepartment(userId: number, departmentId: number): Promise<void> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['departments'],
  //   });
  //   // console.log('user', user);
  //   if(!user){
  //       throw new NotFoundException('User doesnot exist')
  //   }
    
  //   const department = await this.departmentRepository.findOneBy({ id: departmentId });
  //   if(!department){
  //       throw new NotFoundException('Department doesnot exist')
  //   }
  //   const userInDept = await this.departmentRepository.findOne({
  //     where:{id:department.id},
  //     relations:['users']
  //   })
  //   userInDept.users.forEach(eachUser=>{
  //     if(eachUser.id == user.id){
  //     throw new ConflictException('This User Already Exist In The Department ')
  //     }
  //   })
  //   user.departments.push(department);
  //   await this.userRepository.save(user);
  // }
  async assignUserToDepartment(userId: number, departmentId: number): Promise<void> {
    await this.dataSource.transaction(async manager => {
      // Fetch the user with departments relation using the transaction manager
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['departments'],
      });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      // Fetch the department using the transaction manager
      const department = await manager.findOne(Department, {
        where: { id: departmentId },
      });

      if (!department) {
        throw new NotFoundException('Department does not exist');
      }

      // Check if the user is already in the department
      const userInDept = await manager.findOne(Department, {
        where: { id: department.id },
        relations: ['users'],
      });

      userInDept.users.forEach(eachUser => {
        if (eachUser.id === user.id) {
          throw new ConflictException('This User Already Exists In The Department');
        }
      });

      // Add the department to the user's departments and save the user
      user.departments.push(department);
      await manager.save(user);
    });
  }

  async getDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({ relations: ['users'] });
  }
}
