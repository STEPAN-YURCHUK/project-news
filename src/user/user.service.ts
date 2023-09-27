import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/sequelize'
import { FileService } from 'src/file/file.service'
import { v4 as uuidv4 } from 'uuid'
import { RolesService } from './../roles/roles.service'
import { User } from './models/user.model'

@Injectable()
export class UserService {
	constructor(@InjectModel(User) private userRepository: typeof User, private rolesService: RolesService, private jwtService: JwtService, private fileService: FileService) {}

	async createUser(email: string, password: string) {
		const activationLink = uuidv4()
		const role = await this.rolesService.getRoleByValue('USER')
		const user = await this.userRepository.create({
			email,
			password,
			activationLink,
		})

		await user.$set('roles', [role.id])
		user.roles = [role]
		return user
	}

	async getAllUsers() {
		return await this.userRepository.findAll({ include: { all: true } })
	}

	async getUserByEmail(email: string) {
		return await this.userRepository.findOne({ where: { email }, include: { all: true } })
	}

	async findUserByResetToken(token: string) {
		return await this.userRepository.findOne({
			where: { resetPasswordToken: token },
		})
	}

	async getUserByAuthLink(link: string) {
		const user = await this.userRepository.findOne({
			where: { activationLink: link },
		})
		return user
	}

	async deleteUser(id: number) {
		const user = await this.userRepository.findByPk(id)
		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		await user.destroy()
		return { message: 'Пользователь удален успешно' }
	}

	async uploadAvatar(token, file) {
		const payload = this.jwtService.verify(token.split(' ')[1])
		const user = await this.getUserByEmail(payload.email)
		const url = await this.fileService.uploadFile(file)
		if (user.avatar) {
			await this.fileService.deleteFile(user.avatar.split('/')[3])
		}

		user.avatar = url.url
		user.save()

		return user
	}

	async getAvatarById(id: number) {
		const user = await this.userRepository.findOne({ where: { id } })
		return user.avatar
	}
}
