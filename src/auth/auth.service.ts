import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/user/dto/create.user.dto'
import { User } from 'src/user/models/user.model'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { MailService } from './../mail/mail.service'
import { LoginUserDto } from './dto/login.user.dto'
import { RequestPasswordResetDto } from './dto/request.password.reset.dto'
import { ResetPasswordDto } from './dto/reset.password.dto'

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private jwtService: JwtService, private mailService: MailService) {}
	async login(userDto: LoginUserDto) {
		try {
			const user = await this.validateUser(userDto)
			const token = this.generateToken(user)
			const userResponse = {
				user: {
					id: user.id,
					name: user.name,
					surname: user.surname,
					email: user.email,
					isActivate: user.isActivate,
					avatar: user.avatar,
				},
				token,
			}
			return userResponse
		} catch {
			throw new UnauthorizedException({ message: 'Некорректный email или password' })
		}
	}

	async registration(userDto: CreateUserDto) {
		const candidate = await this.userService.getUserByEmail(userDto.email)
		if (candidate) {
			throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
		}
		const hashPassword = await bcrypt.hash(userDto.password, 5)
		const user = await this.userService.createUser(userDto.name, userDto.surname, userDto.email, hashPassword)
		const token = this.generateToken(user)
		const userResponse = {
			user: {
				id: user.id,
				name: user.name,
				surname: user.surname,
				email: user.email,
				isActivate: user.isActivate,
				avatar: user.avatar,
			},
			token,
		}
		return userResponse
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
			throw new HttpException('Пользователь с таким email не найден', HttpStatus.NOT_FOUND)
		}

		const resetToken = uuidv4()
		user.resetPasswordToken = resetToken
		await user.save()

		await this.mailService.sendPasswordResetEmail(dto.email, resetToken)
	}

	async resetPassword(token: string, dto: ResetPasswordDto) {
		const user = await this.userService.findUserByResetToken(token)
		if (!user) {
			throw new Error('Неверный токен сброса пароля')
		}

		user.password = await bcrypt.hash(dto.newPassword, 5)
		user.resetPasswordToken = null
		await user.save()
	}

	async refreshToken(token: string) {
		const refreshToken = token.split(' ')[1]
		const email = await this.decodeToken(refreshToken).email
		const user = await this.userService.getUserByEmail(email)
		const accessAndRefreshToken = this.generateToken(user)
		const userResponse = {
			user: {
				id: user.id,
				name: user.name,
				surname: user.surname,
				email: user.email,
				isActivate: user.isActivate,
				avatar: user.avatar,
			},
			token: accessAndRefreshToken,
		}
		return userResponse
	}

	private generateToken(user: User) {
		const payload = { id: user.id, email: user.email, roles: user.roles }
		return {
			access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
			refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
		}
	}

	private async validateUser(userDto: LoginUserDto) {
		const user = await this.userService.getUserByEmail(userDto.email)
		const passwordEquals = await bcrypt.compare(userDto.password, user.password)
		if (user && passwordEquals) {
			return user
		}
		throw new UnauthorizedException({ message: 'Некорректный email или password' })
	}
}
