import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ResetPasswordDto {
	@ApiProperty({ example: '12345678', description: 'Пароль' })
	@IsString()
	readonly newPassword: string
}
