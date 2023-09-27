import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import * as dotenv from 'dotenv'
import { MailModule } from 'src/mail/mail.module'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
dotenv.config()

@Module({
	imports: [
		UserModule,
		MailModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
