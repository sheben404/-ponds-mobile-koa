import { Service } from 'typedi'
import prisma from 'app/helpers/client'
import { Prisma } from '@prisma/client'

@Service()
export class UserService {
  /**
   * Type 'Prisma.SessionCreateInput' is automatically generated.
   * Whenever you modify file 'prisma/schema.prisma' and then run command:
   *   prisma generate
   *   prisma migrate dev
   * The types is automatically updated.
   *
   * About CRUD: https://www.prisma.io/docs/concepts/components/prisma-client/crud
   */
  async register(userInfo: Prisma.UserCreateInput) {
    return prisma.user.create({
      data: userInfo,
      select: {
        id: true,
        username: true,
        nickname: true,
        phone: true,
        createdAt: true,
      },
    })
  }

  async login(loginInfo: Prisma.UserWhereInput) {
    return prisma.user.findFirst({
      where: {
        username: loginInfo.username,
        password: loginInfo.password,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        phone: true,
        createdAt: true,
      },
    })
  }

  async getInfoById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        phone: true,
        createdAt: true,
      },
    })
  }

  async updateInfo(updateInfo: Prisma.UserUpdateArgs) {
    return prisma.user.update({
      where: updateInfo.where,
      data: updateInfo.data,
      select: {
        id: true,
        username: true,
        nickname: true,
        phone: true,
        createdAt: true,
      },
    })
  }

  async deleteById(id) {
    return prisma.user.delete({
      where: {
        id
      }
    })
  }
}
