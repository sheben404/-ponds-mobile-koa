import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  Put,
} from 'routing-controllers'
import { UserService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'

@JsonController()
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user/register')
  async register(
    @BodyParam('username') username: string,
    @BodyParam('nickname') nickname: string,
    @BodyParam('password') password: string,
    @BodyParam('mobile') mobile: string,
  ): Promise<Prisma.UserGetPayload<any>> {
    return await this.userService.register({
      mobile,
      username,
      nickname,
      password,
    })
  }

  @Post('/user/login')
  async login(
    @BodyParam('username') username: string,
    @BodyParam('password') password: string,
  ): Promise<Prisma.UserGetPayload<any>> {
    if (!username) {
      throw new BadRequestError('username is required')
    }
    if (!password) {
      throw new BadRequestError('username is required')
    }
    return await this.userService.login({
      username,
      password,
    })
  }

  @Get('/user')
  async getInfo(
    @BodyParam('username') username: string
  ): Promise<Prisma.UserGetPayload<any>> {
    return await this.userService.getInfo({username})
  }

  @Put('/user')
  async update(
    @BodyParam('username') username: string,
    @BodyParam('nickname') nickname: string,
    @BodyParam('password') password: string,
    @BodyParam('mobile') mobile: string,
  ): Promise<Prisma.UserGetPayload<any>> {
    return await this.userService.update({
      where: {
        username,
      },
      data: {
        nickname,
        password,
        mobile
      }
    })
  }
}
