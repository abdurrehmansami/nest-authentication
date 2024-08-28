import { Injectable,ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService{
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
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
}