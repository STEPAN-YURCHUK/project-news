import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { MailModule } from './mail/mail.module'
import { Role } from './roles/models/roles.model'
import { UserRoles } from './roles/models/user-roles.model'
import { RolesModule } from './roles/roles.module'
import { User } from './user/models/user.model'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		SequelizeModule.forRoot({
			dialect: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: +process.env.POSTGRES_PORT,
			username: process.env.POSTGRES_USERNAME,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DATABASE,
			models: [User, Role, UserRoles],
			autoLoadModels: true,
		}),
		UserModule,
		AuthModule,
		RolesModule,
		MailModule,
		FileModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
