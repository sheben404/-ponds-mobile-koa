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
    const { fromSort, fromId, fromPondId, referenceSort, toPondId, type } = data
    // 池子类型切换
    if (fromPondId !== toPondId) {
      await prisma.task.update({
        data: {
          pond: +toPondId,
        },
        where: {
          id: +fromId
        }
      })
    }

    if (type === 'after') {
      if (fromSort < referenceSort) {
        const sort1 = await prisma.task.updateMany({
          where: {
              userId,
              sort: {
                lte: +referenceSort,
                gte: +fromSort + 1
              }
          },
          data: {
            sort: {
              decrement: 1
            }
          }
        })
        const sort2 = await prisma.task.update({
          data: {
            sort: +referenceSort
          },
          where: {
            id: +fromId
          }
        })
        return sort1 && sort2
      } else {
        const sort1 = await prisma.task.updateMany({
          where: {
              userId,
              sort: {
                lte: +fromSort - 1,
                gte: +referenceSort + 1
              }
          },
          data: {
            sort: {
              increment: 1
            }
          }
        })
        const sort2 = await prisma.task.update({
          data: {
            sort: +referenceSort + 1
          },
          where: {
            id: +fromId
          }
        })
        return sort1 && sort2
      }
    } else if (type === 'before') {
      if (fromSort < referenceSort) {
        const sort1 = await prisma.task.updateMany({
          where: {
              userId,
              sort: {
                lte: +referenceSort - 1,
                gte: +fromSort + 1
              }
          },
          data: {
            sort: {
              decrement: 1
            }
          }
        })
        const sort2 = await prisma.task.update({
          data: {
            sort: +referenceSort - 1
          },
          where: {
            id: +fromId
          }
        })
        return sort1 && sort2

      } else {
        const sort1 = await prisma.task.updateMany({
          where: {
              userId,
              sort: {
                lte: +fromSort - 1,
                gte: +referenceSort
              }
          },
          data: {
            sort: {
              increment: 1
            }
          }
        })
        const sort2 = await prisma.task.update({
          data: {
            sort: +referenceSort
          },
          where: {
            id: +fromId
          }
        })
        return sort1 && sort2

      }
    }
  }
}
