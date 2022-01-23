import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'

@Service()
export class TaskService {
  async findById(userId) {
    const taskSelect: Prisma.TaskSelect = {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      pond: true,
      importance: true,
      urgency: true,
    }
    return prisma.task.findMany({
      where: {
        userId
      },
      select: taskSelect
    })
  }
  async create(task: Prisma.TaskCreateInput) {
    return prisma.task.create({
      data: task,
    })
  }
  async deleteById(userId: number, taskId: number) {
    return prisma.task.deleteMany({
      where: {
        userId,
        id: taskId
      }
    })
  }
  async editTask(data, taskId: number) {
    const taskSelect: Prisma.TaskSelect = {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      pond: true,
      importance: true,
      urgency: true,
    }
    return prisma.task.update({
      data,
      where: {
        id: taskId
      },
      select: taskSelect
    })
  }
}
