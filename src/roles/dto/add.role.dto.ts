import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class AddRoleDto {
	@ApiProperty({ example: 'ADMIN', description: 'Название роли' })
	@IsString()
	readonly value: string

	@ApiProperty({ example: '2', description: 'ID пользователя которому мы хотим присвоить роль' })
	@IsNumber()
	readonly userId: number
}
