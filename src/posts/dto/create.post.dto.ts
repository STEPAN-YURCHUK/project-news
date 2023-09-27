import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreatePostDto {
	@ApiProperty({ example: 'Новости 2023', description: 'Название поста' })
	@IsString()
	readonly title: string

	@ApiProperty({ example: 'В 2023 случился переворот...', description: 'Контент' })
	@IsString()
	readonly content: string
}
