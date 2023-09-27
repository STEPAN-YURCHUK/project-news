import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ResetPasswordDto {
	@ApiProperty({ example: '123456', description: 'Пароль' })
	@IsString()
	readonly newPassword: string
}
