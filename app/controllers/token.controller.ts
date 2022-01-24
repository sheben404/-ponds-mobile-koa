import {
  BadRequestError,
  Post,
  JsonController,
  Get,
  Put,
  Body,
  UseBefore,
  Ctx,
} from 'routing-controllers'
import { UserService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import { genAccessToken, genRefreshToken } from '../helpers/jwt'
import { AuthHeaderMiddleware } from '../helpers/authHeader'

@JsonController('/token')
@Service()
export class TokenController {
  constructor(private userService: UserService) {}
  // 测试使用
  @UseBefore(AuthHeaderMiddleware)
  @Get()
  async getToken(@Ctx() ctx: any) {
    const { userId } = ctx
    const access_token = genAccessToken({ userId })
    return {
      msg: '注册成功',
      data: { access_token },
    }
  }
}
