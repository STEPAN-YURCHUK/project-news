import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { User } from 'src/user/models/user.model'
import { Role } from './models/roles.model'
import { UserRoles } from './models/user-roles.model'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'

@Module({
	imports: [SequelizeModule.forFeature([Role, User, UserRoles]), forwardRef(() => AuthModule)],
	controllers: [RolesController],
	providers: [RolesService],
	exports: [RolesService],
})
export class RolesModule {}
