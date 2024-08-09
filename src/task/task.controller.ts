import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  async create(@Body() task: TaskDto): Promise<TaskDto> {
    return await this.taskService.create(task);
    //console.log(task);
  }

  /* 
  @Get()
  findAll(): TaskDto[] {
    console.log('---------- findAll');
    return this.taskService.findAll();
  } 
  */

  @Get()
  async findFilter(@Query() params: FindAllParameters): Promise<TaskDto[]> {
    return await this.taskService.findFilter(params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<TaskDto> {
    return await this.taskService.findById(id);
    //console.log(id);
  }

  @Put()
  update(@Body() task: TaskDto) {
    this.taskService.update(task);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    this.taskService.deleteById(id);
  }
}
