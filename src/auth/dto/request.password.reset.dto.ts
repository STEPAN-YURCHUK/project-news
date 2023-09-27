import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class RequestPasswordResetDto {
	@ApiProperty({ example: 'admin@admin.com', description: 'Почтовый адрес' })
	@IsEmail()
	readonly email: string
}
