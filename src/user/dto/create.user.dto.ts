import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateUserDto {
	@ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
	@IsString()
	readonly name: string

	@ApiProperty({ example: 'Иванов', description: 'Фамилия' })
	@IsString()
	readonly surname: string

	@ApiProperty({ example: 'admin@admin.com', description: 'Почтовый адрес' })
	@IsEmail()
	readonly email: string

	@ApiProperty({ example: '12345678', description: 'Пароль' })
	@IsString()
	readonly password: string
}
