import { Controller, Post, Body, UnauthorizedException, Get, Headers, Param, Patch, Query, ValidationPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateDeptDto } from 'src/department/dto/create.dept.dto';
// import { AuthService } from './auth.service';
// import { SignupDto } from './dto/signup.dto';
// import { LoginDto } from './dto/login.dto';
// import { AppService } from 'src/app.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  // constructor(private readonly appService: AppService) {}

  @Post()
 async createProject (@Body(ValidationPipe) createProjectDto: CreateDeptDto) {
    const project = await this.projectService.createProject(createProjectDto.name);
    return project;
  }

  async assignProjectToDept(){}
  @Get('getHello')
  async getHello(@Headers() headers){
    console.log('HEADERS',headers);
    
    // return this.appService.getHello()
  
  }

  
}