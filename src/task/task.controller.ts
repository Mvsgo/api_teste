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
import { FindAllParameters, TaskDto, TaskRouteParameters } from './task.dto';
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

  @Put('/:id')
  async update(@Param() params: TaskRouteParameters, @Body() task: TaskDto) {
    await this.taskService.update(params.id, task);
  }

  @Delete('/:id')
  async delete(@Param() params: TaskRouteParameters) {
    return await this.taskService.deleteById(params.id);
  }
}
