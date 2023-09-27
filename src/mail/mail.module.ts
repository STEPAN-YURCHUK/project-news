import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { UserModule } from 'src/user/user.module'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'
dotenv.config()

@Module({
	imports: [
		UserModule,
		MailerModule.forRoot({
			transport: {
				host: process.env.SMTP_HOST,
				port: 465,
				secure: true,
				auth: {
					user: process.env.SMTP_USERNAME,
					pass: process.env.SMTP_PASSWORD,
				},
			},
		}),
	],

	controllers: [MailController],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
