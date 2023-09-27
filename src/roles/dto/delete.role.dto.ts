import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteRoleDto {
	@ApiProperty({ example: 'ADMIN', description: 'Название роли' })
	@IsString()
	readonly value: string
}
