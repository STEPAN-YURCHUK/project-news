import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/user/dto/create.user.dto'
import { User } from 'src/user/models/user.model'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { MailService } from './../mail/mail.service'
import { RequestPasswordResetDto } from './dto/request.password.reset.dto'

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private jwtService: JwtService, private mailService: MailService) {}

	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto)
		const token = this.generateToken(user)
		return { user, token }
	}

	async registration(userDto: CreateUserDto) {
		const candidate = await this.userService.getUserByEmail(userDto.email)
		if (candidate) {
			throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
		}
		const hashPassword = await bcrypt.hash(userDto.password, 5)
		const user = await this.userService.createUser(userDto.email, hashPassword)
		const token = this.generateToken(user)
		return { user, token }
	}

	decodeToken(token: string) {
		try {
			const decoded = this.jwtService.verify(token)
			return decoded
		} catch (error) {
			throw new Error('Invalid token')
		}
	}

	async requestPasswordReset(dto: RequestPasswordResetDto) {
		const user = await this.userService.getUserByEmail(dto.email)
		if (!user) {
			throw new Error('Пользователь с таким email не найден')
		}

		const resetToken = uuidv4()
		user.resetPasswordToken = resetToken
		await user.save()

		await this.mailService.sendPasswordResetEmail(dto.email, resetToken)
	}

	async resetPassword(token: string, newPassword: string) {
		const user = await this.userService.findUserByResetToken(token)
		if (!user) {
			throw new Error('Неверный токен сброса пароля')
		}

		user.password = await bcrypt.hash(newPassword, 5)
		user.resetPasswordToken = null
		await user.save()
	}

	async refreshToken(token: string) {
		const refreshToken = token.split(' ')[1]
		const email = await this.decodeToken(refreshToken).email
		const user = await this.userService.getUserByEmail(email)
		const accessAndRefreshToken = await this.generateToken(user)
		return { user, accessAndRefreshToken }
	}

	private generateToken(user: User) {
		const payload = { id: user.id, email: user.email, roles: user.roles }
		return {
			access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
			refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
		}
	}

	private async validateUser(userDto: CreateUserDto) {
		const user = await this.userService.getUserByEmail(userDto.email)
		const passwordEquals = await bcrypt.compare(userDto.password, user.password)
		if (user && passwordEquals) {
			return user
		}
		throw new UnauthorizedException({ message: 'Некорректный email или password' })
	}
}
