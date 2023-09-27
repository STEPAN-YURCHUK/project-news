import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MailService } from './mail.service'

@ApiTags('Почта')
@Controller('mail')
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@ApiOperation({ summary: 'Ссылка на которую переходишь что бы подтвердить почту' })
	@ApiParam({ name: 'link', description: 'Ссылка активации', type: String })
	@ApiResponse({ status: 200, description: 'Успешно', schema: { example: { message: 'Подтверждение отправлено на почту: admin@admin.com' } } })
	@Get('activate/:link')
	async activate(@Param('link') activationLink: string) {
		return await this.mailService.activate(activationLink)
	}

	@ApiOperation({ summary: 'Активация по электронной почте' })
	@ApiBody({ description: 'Адрес электронной почты', type: String })
	@ApiResponse({ status: 200, description: 'Успешно', schema: { example: { message: 'Подтверждение отправлено на почту' } } })
	@Post('activate')
	async activateEmail(@Body('email') email: string) {
		await this.mailService.sendActivationMail(email)
		return { message: 'Подтверждение отправлено на почту' }
	}
}
