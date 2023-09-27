import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { UserService } from 'src/user/user.service'
dotenv.config()

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService, private userService: UserService) {}

	async sendActivationMail(email: string) {
		const user = await this.userService.getUserByEmail(email)
		if (!user) {
			throw new Error('Пользователь с таким email не найден')
		}
		await this.mailerService.sendMail({
			from: process.env.SMTP_USERNAME,
			to: email,
			subject: 'Активация аккаунта на ' + process.env.API_URL,
			text: '',
			html: `
                    <div>
                        <h1>Для активации почты перейдите по ссылке</h1>
                        <a href="${process.env.API_URL}/mail/activate/${user.activationLink}">${process.env.API_URL}/mail/activate/${user.activationLink}</a>
                    </div>
                `,
		})

		return { message: `Подтверждение отправлено на почту: ${user.email}` }
	}

	async activate(activationLink: string) {
		const user = await this.userService.getUserByAuthLink(activationLink)
		if (!user) {
			throw new UnauthorizedException({
				message: 'Некоректная ссылка активации',
			})
		}
		user.isActivate = true
		user.save()
		return `Почта ${user.email} подтверждена`
	}

	async sendPasswordResetEmail(email: string, resetToken: string) {
		await this.mailerService.sendMail({
			from: process.env.SMTP_USERNAME,
			to: email,
			subject: 'Сброс пароля',
			text: `Для сброса пароля перейдите по ссылке: ${process.env.API_URL}/auth/reset-password?token=${resetToken}`,
		})
	}
}
