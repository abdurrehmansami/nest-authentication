import { Injectable,ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Project } from './entities/project.entity';
import { Department } from 'src/department/entities/department.entity';
import { log } from 'console';

@Injectable()
export class ProjectService{
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
        private readonly dataSource: DataSource,
      ) {}

      async createProject(name:string): Promise<Project>{
        return await this.dataSource.transaction(async manager => {
            const alreadyExist = await manager.findOne(Project, { where: { name } });

      if (alreadyExist) {
        throw new ConflictException('Project Already Exists');
      }
        const project = manager.create(Project, {name})
        return this.projectRepository.save(project)
      })
}
      async assignProjectToDept(departmentId: number, projectId: number): Promise<Department>{

        return await this.dataSource.transaction(async manager => { 
          try{
            const deptToAssignIn = await manager.findOne(Department,{where:{id: departmentId},relations:['projects']})
            const projToAssign = await manager.findOne(Project,{where:{id:projectId}})
            if(!projToAssign){
              throw new NotFoundException('Project Doesnot Exist')
            }  
            if(!deptToAssignIn){
              throw new NotFoundException('Department Doesnot Exist') 
            }

            deptToAssignIn.projects.forEach(project=>{
            if(project.id==projToAssign.id)
            {
              throw new ConflictException('Project already exist in the department')
            }
            })
            deptToAssignIn.projects.push(projToAssign)
            await manager.save(deptToAssignIn)
            return deptToAssignIn
          }
          catch(error){
            // Handle the error appropriately to prevent the server from crashing
            if (error instanceof NotFoundException || error instanceof ConflictException) {
              throw error
    
            } else {
              // Log the error and throw a generic internal server error
              console.error('Transaction failed:', error);
              throw new InternalServerErrorException('An unexpected error occurred');
            
            }
          
          }
            })
        
    
      
      
}
      async getProjects(){
        return this.projectRepository.find({relations:['department']})
      }}