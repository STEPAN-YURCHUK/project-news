import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/auth/decorators/roles-auth.decorator'
import { RoleGuard } from 'src/auth/guards/roles.guard'
import { AddRoleDto } from './dto/add.role.dto'
import { CreateRoleDto } from './dto/create.role.dto'
import { DeleteRoleDto } from './dto/delete.role.dto'
import { Role } from './models/roles.model'
import { RolesService } from './roles.service'

@ApiTags('Роли')
@ApiSecurity('JWT-auth')
@Controller('roles')
export class RolesController {
	constructor(private roleService: RolesService) {}

	@ApiOperation({ summary: 'Создание роли' })
	@ApiResponse({ status: 200, type: Role })
	@Roles('ADMIN')
	@UseGuards(RoleGuard)
	@Post('createRole')
	createRole(@Body() roleDto: CreateRoleDto) {
		return this.roleService.createRole(roleDto)
	}

	@ApiOperation({ summary: 'Выдача ролей' })
	@ApiResponse({ status: 200, type: AddRoleDto })
	@Roles('ADMIN')
	@UseGuards(RoleGuard)
	@Post('addRole')
	addRole(@Body() dto: AddRoleDto) {
		return this.roleService.addRole(dto)
	}

	@ApiOperation({ summary: 'Удаление роли' })
	@ApiBody({ type: DeleteRoleDto })
	@ApiResponse({ status: 200, description: 'Успешно', type: Object })
	@Roles('ADMIN')
	@UseGuards(RoleGuard)
	@Delete('deleteRole')
	deleteRole(@Body() dto: DeleteRoleDto) {
		return this.roleService.deleteRole(dto)
	}
}
