import { Prisma } from '@prisma/client'
import { BadRequestError, Body, Ctx, Delete, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers'
import { Service } from 'typedi'
import { AuthHeaderMiddleware } from '../helpers/authHeader'
import { TaskService } from '../services'

@JsonController('/task')
@Service()
@UseBefore(AuthHeaderMiddleware)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async query(@Ctx() ctx: any) {
    const { userId } = ctx
    const data = await this.taskService.findById(userId)
    return {
      data
    }
  }

  @Post()
  async create(
    @Ctx() ctx: any,
    @Body() task: Prisma.TaskCreateInput,
  ) {
    const { userId } = ctx
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
    const result = await this.taskService.create(data)
    return {
      msg: "添加成功",
      data: result
    }
  }

  @Delete('/:id/')
  async deleteTask(@Ctx() ctx: any, @Param('id') id: number) {
    const { userId } = ctx
    this.taskService.deleteById(userId, +id)
    return {
      msg: "删除任务成功",
      data: true
    }
  }

  @Delete('/test/:id/')
  async deleteTaskTest(@Ctx() ctx: any, @Param('id') id: string) {
    const { userId } = ctx
    // const result = await this.taskService.deleteById(userId, +id.slice(1))
    return {
      msg: "删除任务成功",
      data: true
    }
  }

  @Put('/:id/')
  async editTask(@Body() task: Prisma.TaskCreateInput, @Param('id') id: number) {
    // const { userId } = ctx
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
    const result = await this.taskService.editTask(task, id)
    return {
      msg: "更新信息成功",
      data: result
    }
  }

  @Post('/reorder')
  async reorder(@Body() orderInfo, @Ctx() ctx: any) {
    const { userId } = ctx
    const result = await this.taskService.reorderTask(orderInfo, userId)
    if (result) {
      return {
        msg: "排序成功",
        data: true
      }
    } else {
      return {
        msg: "排序失败",
        data: false
      }
    }
  }
}
