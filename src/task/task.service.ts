import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { EnumTaskStatus, FindAllParameters, TaskDto } from './task.dto';
import { v4 as uuid } from 'uuid';
@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    task.id = uuid();
    task.status = EnumTaskStatus.TO_DO;
    this.tasks.push(task);
    //console.log(this.tasks);
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
}
