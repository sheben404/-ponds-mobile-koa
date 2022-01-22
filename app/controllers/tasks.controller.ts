import { Prisma } from '@prisma/client'
import { BadRequestError, Body, Delete, Get, HeaderParam, JsonController, Param, Post, Put } from 'routing-controllers'
import { Service } from 'typedi'
import { decodeToken } from '../helpers/jwt'
import { TaskService } from '../services'

@JsonController()
@Service()
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/task')
  async query(@HeaderParam('Authorization') Authorization: string) {
    const { userId } = decodeToken(Authorization).data
    const data = await this.taskService.findById(userId)
    return {
      data
    }
  }

  @Post('/task')
  async create(
    @HeaderParam('Authorization') Authorization: string,
    @Body() task: Prisma.TaskCreateInput,
  ): Promise<Prisma.TaskGetPayload<any>> {
    const { userId } = decodeToken(Authorization).data
    const { title, pond, description, urgency, importance } = task
    if (!title) {
      throw new BadRequestError('title is required')
    }
    if (!pond) {
      throw new BadRequestError('pond is required')
    } else {
      task.pond = Number(pond)
    }
    if (importance) {
      task.importance = Number(importance)
    }
    if (urgency) {
      task.urgency = Number(urgency)
    }
    const data = {
      ...task,
      userId
    }
    return await this.taskService.create(data)
  }

  @Delete('/task/:id/')
  async deleteTask(@HeaderParam('Authorization') Authorization: string, @Param('id') id: string) {
    const { userId } = decodeToken(Authorization).data
    console.log(userId, id);
    const result = await this.taskService.deleteById(userId, +id.slice(1))
    return {
      msg: "删除任务成功",
      data: true
    }
  }

  @Put('/task/:id/')
  async editTask(@HeaderParam('Authorization') Authorization: string, @Body() task: Prisma.TaskCreateInput, @Param('id') id: string) {
    const { userId } = decodeToken(Authorization).data
    const { pond, urgency, importance } = task
    if (pond) {
      task.pond = +pond
    }
    if (importance) {
      task.importance = +importance
    }
    if (urgency) {
      task.urgency = +urgency
    }
    return await this.taskService.editTask(task, +id.slice(1))
  }
}
