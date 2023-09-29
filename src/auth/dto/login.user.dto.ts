import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginUserDto {
	@ApiProperty({ example: 'admin@admin.com', description: 'Почтовый адрес' })
	@IsEmail()
	readonly email: string

	@ApiProperty({ example: '12345678', description: 'Пароль' })
	@IsString()
	readonly password: string
}
