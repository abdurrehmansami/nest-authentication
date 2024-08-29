import { Controller, Post, Body, Param, Get, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDeptDto } from './dto/create.dept.dto';
import { Public } from 'src/public.decorator';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Public()
  async createDepartment(@Body(ValidationPipe) createDeptDto:CreateDeptDto) {
    return this.departmentService.createDepartment(createDeptDto.name);
  }

  @Post(':departmentId/users/:userId')
  async assignUserToDepartment(
    @Param('departmentId',ParseIntPipe) departmentId: number,
    @Param('userId',ParseIntPipe) userId: number,
  ) {
    return this.departmentService.assignUserToDepartment(userId, departmentId);
  }

  @Get()
  @Public()
  async getDepartments() {
    return this.departmentService.getDepartments();
  }
}
