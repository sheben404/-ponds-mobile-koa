import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'

@Service()
export class TaskService {
  static taskSelect: Prisma.TaskSelect = {
    id: true,
    title: true,
    description: true,
    startDate: true,
    endDate: true,
    pond: true,
    importance: true,
    urgency: true,
    sort: true,
  }
  async findById(userId) {
    return prisma.task.findMany({
      where: {
        userId
      },
      select: TaskService.taskSelect
    })
  }
  async create(task: Prisma.TaskCreateInput) {
    const count = await prisma.task.count({
      where: {
        userId: task.userId,
      }
    })
    return prisma.task.create({
      data: {
        ...task,
        sort: count
      },
    })
  }
  async deleteById(userId: number, taskId: number) {
    const res = await prisma.task.delete({
      where: {
        id: taskId
      }
    })
    // 大于删除元素的sort -1
    await prisma.task.updateMany({
      where: {
        userId,
        sort: {
          gt: res.sort
        }
      },
      data: {
        sort: {
          decrement: 1
        }
      }
    })
    return res
  }
  async editTask(data: Prisma.TaskUpdateInput, taskId: number) {
    return prisma.task.update({
      data,
      where: {
        id: taskId
      },
      select: TaskService.taskSelect
    })
  }

  async reorderTask(data: any, userId: number) {
    const { fromId, fromPondId, referenceId, toPondId, offset } = data
    // 池子类型切换
    if (fromPondId !== toPondId) {
      await prisma.task.update({
        data: {
          pond: toPondId,
        },
        where: {
          id: fromId
        }
      })
    }

    const from = await prisma.task.findUnique({
      where: {
        id: fromId
      }
    })
    const reference = await prisma.task.findUnique({
      where: {
        id: referenceId
      }
    })

    const fromSort = from.sort
    const referenceSort = reference.sort
    // 修改移动的元素
    await prisma.task.update({
      data: {
        sort: fromSort + offset
      },
      where: {
        id: fromId
      }
    })
    // 修改偏移量范围内的元素
    if (offset > 0) {
      return await prisma.task.updateMany({
        where: {
            userId,
            sort: {
              lte: referenceSort,
              gt: fromSort
            }
        },
        data: {
          sort: {
            decrement: 1
          }
        }
      })
    } else {
      return await prisma.task.updateMany({
        where: {
          userId,
          sort: {
            lt: fromSort,
            gte: referenceSort
          }
        },
        data: {
          sort: {
            increment: 1
          }
        }
      })
    }
  }
}
