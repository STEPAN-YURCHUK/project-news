import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from 'src/user/models/user.model'
import { AddRoleDto } from './dto/add.role.dto'
import { CreateRoleDto } from './dto/create.role.dto'
import { DeleteRoleDto } from './dto/delete.role.dto'
import { Role } from './models/roles.model'

@Injectable()
export class RolesService {
	constructor(@InjectModel(Role) private roleRepository: typeof Role, @InjectModel(User) private userRepository: typeof User) {}

	async createRole(roleDto: CreateRoleDto) {
		const role = await this.roleRepository.create(roleDto)
		return role
	}

	async getRoleByValue(value: string) {
		const role = await this.roleRepository.findOne({ where: { value } })
		if (!role) {
			throw new NotFoundException('Роль не найден')
		}
		return role
	}

	async addRole(dto: AddRoleDto) {
		const user = await this.userRepository.findByPk(dto.userId)
		const role = await this.getRoleByValue(dto.value)
		if (role && user) {
			await user.$add('role', role.id)
			return dto
		}
		throw new HttpException('Пользователь или роль не найдена', HttpStatus.NOT_FOUND)
	}

	async deleteRole(dto: DeleteRoleDto) {
		const role = await this.getRoleByValue(dto.value)
		if (!role) {
			throw new NotFoundException('Роль не найден')
		}

		await role.destroy()
		return { message: 'Роль удалена успешно' }
	}
}
