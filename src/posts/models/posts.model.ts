import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/user/models/user.model'

@Table({ tableName: 'posts' })
export class Posts extends Model<Posts> {
	@ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id: number

	@ApiProperty({ example: 'Новости 2023', description: 'Название поста' })
	@Column({ type: DataType.STRING, allowNull: false })
	title: string

	@ApiProperty({ example: 'В 2023 случился переворот...', description: 'Контент' })
	@Column({ type: DataType.STRING, allowNull: false })
	content: string

	@ApiProperty({ example: 'https://yurchuklinux.s3.amazonaws.com/%D0%A.png', description: 'Ссылка на фото' })
	@Column({ type: DataType.STRING, defaultValue: null })
	image: string

	@ApiProperty({ example: '1', description: 'ID пользователя' })
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER })
	userId: number

	@BelongsTo(() => User)
	author: User
}
