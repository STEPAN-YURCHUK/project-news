import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ActivateEmailDto {
	@ApiProperty({ example: 'admin@admin.com', description: 'Email' })
	@IsString()
	readonly email: string
}
