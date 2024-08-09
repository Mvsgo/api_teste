import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum EnumTaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class TaskDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @MinLength(3)
  @MaxLength(256)
  @IsString()
  title: string;

  @MinLength(3)
  @MaxLength(256)
  @IsString()
  description: string;

  @IsEnum(EnumTaskStatus)
  @IsOptional()
  status: string;

  @IsDateString()
  expirationDate: Date;
}

export interface FindAllParameters {
  title: string;
  status: string;
}

export class TaskRouteParameters {
  @IsUUID()
  id: string;
}