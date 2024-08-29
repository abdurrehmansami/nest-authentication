import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service'; 
import { ProjectController } from './project.controller';
import  {Project} from './entities/project.entity'
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Department])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
