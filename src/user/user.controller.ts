import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/auth/decorators/roles-auth.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/roles.guard'
import { User } from './models/user.model'
import { UserService } from './user.service'

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@ApiSecurity('JWT-auth')
	@ApiOperation({ summary: 'Получить всех пользователей' })
	@ApiResponse({ status: 200, description: 'Список пользователей', type: [User] })
	@Roles('ADMIN')
	@UseGuards(RoleGuard)
	@Get('getAllUsers')
	getAll() {
		return this.userService.getAllUsers()
	}

	@ApiSecurity('JWT-auth')
	@ApiOperation({ summary: 'Удаление пользователя' })
	@ApiParam({ name: 'id', description: 'Идентификатор пользователя', type: 'number' })
	@ApiResponse({ status: 200, description: 'Пользователь успешно удален', schema: { example: { message: 'Пользователь удален успешно' } } })
	@Roles('ADMIN')
	@UseGuards(RoleGuard)
	@Delete('deleteUser/:id')
	deleteUser(@Param('id') id: number) {
		return this.userService.deleteUser(id)
	}

	@ApiSecurity('JWT-auth')
	@ApiOperation({ summary: 'Загрузка аватара пользователя' })
	@ApiBody({ description: 'Файл аватара', type: 'file' })
	@ApiResponse({ status: 200, type: User })
	@UseGuards(JwtAuthGuard)
	@Post('uploadAvatar')
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(@UploadedFile() file, @Req() request, @Res() response) {
		try {
			const token = request.headers.authorization
			const log = await this.userService.uploadAvatar(token, file)
			return response.status(200).json(log)
		} catch (error) {
			return response.status(500).json(`Failed to upload image file: ${error.message}`)
		}
	}

	@ApiOperation({ summary: 'Просмотр аватара по ID пользователя' })
	@ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
	@ApiResponse({ status: 200, description: 'Успешно', schema: { example: 'https://yurchuklinux.s3.amazonaws.com/EfH1b-0U8AArfmi.jpeg' } })
	@Get('getAvatarById/:id')
	getAvatarById(@Param('id') id: number) {
		return this.userService.getAvatarById(id)
	}
}
