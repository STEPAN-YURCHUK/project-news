import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'src/user/dto/create.user.dto'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login.user.dto'
import { RequestPasswordResetDto } from './dto/request.password.reset.dto'
import { ResetPasswordDto } from './dto/reset.password.dto'
import { UserResponseDto } from './dto/user.response.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: 'Аутентификация пользователя' })
	@ApiBody({ schema: { example: { email: 'admin@admin.com', password: '12345678' } } })
	@ApiResponse({ status: 200, description: 'Успешно', type: UserResponseDto })
	@Post('/login')
	login(@Body() userDto: LoginUserDto) {
		return this.authService.login(userDto)
	}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({ status: 200, description: 'Успешно', type: UserResponseDto })
	@Post('/registration')
	registration(@Body() userDto: CreateUserDto) {
		return this.authService.registration(userDto)
	}

	@ApiOperation({ summary: 'Запрос на сброс пароля' })
	@ApiBody({ type: RequestPasswordResetDto })
	@ApiResponse({ status: 200, description: 'Успешно', schema: { example: { message: 'Письмо для сброса пароля отправлено на ваш email' } } })
	@Post('request-password-reset')
	async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
		await this.authService.requestPasswordReset(dto)
		return { message: 'Письмо для сброса пароля отправлено на ваш email' }
	}

	@ApiOperation({ summary: 'Сброс пароля' })
	@ApiQuery({ name: 'token', description: 'Токен сброса пароля' })
	@ApiBody({ type: ResetPasswordDto, description: 'Новый пароль' })
	@ApiResponse({ status: 200, description: 'Успешно', schema: { example: { message: 'Пароль успешно изменен' } } })
	@Post('reset-password')
	async resetPassword(@Query('token') token: string, @Body() dto: ResetPasswordDto) {
		await this.authService.resetPassword(token, dto)
		return { message: 'Пароль успешно изменен' }
	}

	@ApiSecurity('JWT-auth')
	@ApiOperation({ summary: 'Обновление токена' })
	@ApiResponse({ status: 200, description: 'Успешно', type: UserResponseDto })
	@UseGuards(JwtAuthGuard)
	@Post('refresh')
	async refreshToken(@Req() req: any) {
		return await this.authService.refreshToken(req.headers.authorization)
	}
}
