import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { FileModule } from 'src/file/file.module'
import { Role } from 'src/roles/models/roles.model'
import { UserRoles } from 'src/roles/models/user-roles.model'
import { RolesModule } from 'src/roles/roles.module'
import { User } from './models/user.model'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [SequelizeModule.forFeature([User, Role, UserRoles]), forwardRef(() => RolesModule), forwardRef(() => AuthModule), JwtModule, FileModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
