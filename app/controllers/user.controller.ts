import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  Put,
  HeaderParam,
} from 'routing-controllers'
import { UserService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import ResModel from '../helpers/resModel'
import { decodeToken, genToken } from '../helpers/jwt'

@JsonController()
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user/register')
  async register(
    @BodyParam('username') username: string,
    @BodyParam('nickname') nickname: string,
    @BodyParam('password') password: string,
    @BodyParam('phone') phone: string,
  ) {
    const registerRes = await this.userService.register({
      phone,
      username,
      nickname,
      password,
    })
    if (registerRes.id) {
      const token = genToken({ userId: registerRes.id })
      return new ResModel(200, '注册成功', Object.assign(registerRes, { token: token }))
    }
  }

  @Post('/user/login')
  async login(
    @BodyParam('username') username: string,
    @BodyParam('password') password: string,
  ) {
    const loginRes = await this.userService.login({
      username,
      password,
    })
    if (loginRes.id) {
      const token = genToken({ userId: loginRes.id })
      return new ResModel(200, '登录成功', Object.assign(loginRes, { token: token }))
    }
  }

  @Get('/user')
  async getInfo(@HeaderParam('Authorization') Authorization: string) {
    const tokenData = decodeToken(Authorization).data
    const getInfoRes = await this.userService.getInfoById(tokenData.userId)
    if (getInfoRes.id) {
      return new ResModel(200, '获取用户信息成功', getInfoRes)
    }
  }

  @Put('/user')
  async update(
    @HeaderParam('Authorization') Authorization: string,
    @BodyParam('nickname') nickname: string,
    @BodyParam('password') password: string,
    @BodyParam('phone') phone: string,
  ) {
    const tokenData = decodeToken(Authorization).data
    const updateInfoRes = await this.userService.updateInfo({
      where: {
        id: tokenData.userId,
      },
      data: {
        nickname,
        password,
        phone,
      },
    })
    if (updateInfoRes.id) {
      return new ResModel(200, '修改用户信息成功', updateInfoRes)
    }
  }

  // 测试使用
  @Post('/user/test/delete')
  async delete(@HeaderParam('Authorization') Authorization: string) {
    const tokenData = decodeToken(Authorization).data
    const deleteRes = await this.userService.deleteById(tokenData.userId)
    return new ResModel(200, '删除用户成功', deleteRes)
  }
}
