import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { EnumTaskStatus, FindAllParameters, TaskDto } from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}
  private tasks: TaskDto[] = [];

  async create(task: TaskDto) {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      expirationDate: task.experationDate,
      status: EnumTaskStatus.TO_DO,
    };

    const createTask = await this.taskRepository.save(taskToSave);
    return this.mapEntityToDto(createTask);
  }

  findById(id: string): TaskDto {
    const foudTask = this.tasks.filter((t) => t.id == id);

    if (foudTask.length) {
      return foudTask[0];
    }

    throw new HttpException(
      'Task with id ${id} not found',
      HttpStatus.NOT_FOUND,
    );
  }

  //findAll(): TaskDto[] {
  //  return this.tasks;
  //}

  findFilter(params: FindAllParameters): TaskDto[] {
    if (params.title == undefined && params.status == undefined) {
      console.log('1');
      return this.tasks;
    } else {
      console.log('2');
      return this.tasks.filter((t) => {
        let match = true;
        if (params.title != undefined && t.title !== params.title) {
          match = false;
        }
        if (params.status != undefined && t.status !== params.status) {
          match = false;
        }
        return match;
      });
    }
  }

  update(task: TaskDto) {
    const taskIndex = this.tasks.findIndex((t) => t.id === task.id);
    //console.log(taskIndex);

    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;
      return;
    }

    throw new HttpException(
      'Task with id ${id} not found',
      HttpStatus.BAD_REQUEST,
    );
  }

  deleteById(id: string) {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    //console.log(taskIndex);

    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return;
    }

    throw new HttpException(
      'Task with id $id not found',
      HttpStatus.BAD_REQUEST,
    );
  }

  private mapEntityToDto(TaskEntity: TaskEntity): TaskDto {
    return {
      id: TaskEntity.id,
      title: TaskEntity.title,
      description: TaskEntity.description,
      experationDate: TaskEntity.expirationDate,
      status: EnumTaskStatus[TaskEntity.status],
    };
  }
}
