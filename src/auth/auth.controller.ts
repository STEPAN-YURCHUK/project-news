import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'src/user/dto/create.user.dto'
import { AuthService } from './auth.service'
import { RefreshTokenResponseDto } from './dto/refreshToken-response.dto'
import { RequestPasswordResetDto } from './dto/request.password.reset.dto'
import { ResetPasswordDto } from './dto/reset.password.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: 'Аутентификация пользователя' })
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({ status: 200, description: 'Успешно', type: Object })
	@Post('/login')
	login(@Body() userDto: CreateUserDto) {
		return this.authService.login(userDto)
	}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({ status: 200, description: 'Успешно', type: Object })
	@Post('/registration')
	registration(@Body() userDto: CreateUserDto) {
		return this.authService.registration(userDto)
	}

	@ApiOperation({ summary: 'Запрос на сброс пароля' })
	@ApiBody({ type: RequestPasswordResetDto })
	@ApiResponse({ status: 200, description: 'Успешно', type: Object })
	@Post('request-password-reset')
	async requestPasswordReset(@Body('email') dto: RequestPasswordResetDto) {
		await this.authService.requestPasswordReset(dto)
		return { message: 'Письмо для сброса пароля отправлено на ваш email' }
	}

	@ApiOperation({ summary: 'Сброс пароля' })
	@ApiQuery({ name: 'token', description: 'Токен сброса пароля' })
	@ApiBody({ type: ResetPasswordDto, description: 'Новый пароль' })
	@ApiResponse({ status: 200, description: 'Успешно', type: Object })
	@Post('reset-password')
	async resetPassword(@Query('token') token: string, @Body('newPassword') dto: ResetPasswordDto) {
		await this.authService.resetPassword(token, dto.newPassword)
		return { message: 'Пароль успешно изменен' }
	}

	@ApiSecurity('JWT-auth')
	@ApiOperation({ summary: 'Обновление токена' })
	@ApiResponse({ status: 200, description: 'Успешно', type: RefreshTokenResponseDto })
	@UseGuards(JwtAuthGuard)
	@Post('refresh')
	async refreshToken(@Req() req: any) {
		const result = await this.authService.refreshToken(req.headers.authorization)
		const responseDto: RefreshTokenResponseDto = {
			user: result.user,
			token: result.accessAndRefreshToken,
		}
		return responseDto
	}
}
