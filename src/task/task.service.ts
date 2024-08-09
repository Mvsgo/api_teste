import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { EnumTaskStatus, FindAllParameters, TaskDto } from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) { }
  private tasks: TaskDto[] = [];

  async create(task: TaskDto) {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      expirationDate: task.expirationDate,
      status: EnumTaskStatus.TO_DO,
    };

    const createTask = await this.taskRepository.save(taskToSave);
    return this.mapEntityToDto(createTask);
  }

  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    if (!foundTask) {
      throw new HttpException(`Task com id ${id} não encontrado`, HttpStatus.NOT_FOUND);
    }

    return this.mapEntityToDto(foundTask);
  }

  //findAll(): TaskDto[] {
  //  return this.tasks;
  //}

  async findFilter(params: FindAllParameters): Promise<TaskDto[]> {
    let tasksFound;
    if (params.title == undefined && params.status == undefined) {
      console.log('1');
      tasksFound = await this.taskRepository.find();

    } else {
      console.log('2');
      const searchParams: FindOptionsWhere<TaskEntity> = {};

      if (params.title) {
        searchParams.title = Like(`%${params.title}%`);
      }

      if (params.status) {
        searchParams.status = Like(`%${params.status}%`);
      }

      tasksFound = await this.taskRepository.find({ where: searchParams });

    }

    return tasksFound.map(TaskEntity => this.mapEntityToDto(TaskEntity));

  }

  async update(id: string, task: TaskDto) {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    if (!foundTask) {
      throw new HttpException(`Task com id ${id} não encontrado`, HttpStatus.BAD_REQUEST);
    }

    return this.taskRepository.update(id, this.mapDtoToEntity(task));
  }

  async deleteById(id: string) {
    const deleteResult = await this.taskRepository.delete(id);
    if (!deleteResult.affected) {
      throw new HttpException(`Task with id ${id} not found`, HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(TaskEntity: TaskEntity): TaskDto {
    return {
      id: TaskEntity.id,
      title: TaskEntity.title,
      description: TaskEntity.description,
      expirationDate: TaskEntity.expirationDate,
      status: EnumTaskStatus[TaskEntity.status],
    };
  }

  private mapDtoToEntity(TaskDto: TaskDto): Partial<TaskEntity> {
    return {
      //id: TaskDto.id,
      title: TaskDto.title,
      description: TaskDto.description,
      expirationDate: TaskDto.expirationDate,
      status: TaskDto.status.toString()
    };
  }
}
