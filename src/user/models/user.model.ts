import { ApiProperty } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { Posts } from 'src/posts/models/posts.model'
import { Role } from 'src/roles/models/roles.model'
import { UserRoles } from 'src/roles/models/user-roles.model'

@Table({ tableName: 'users' })
export class User extends Model<User> {
	@ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id: number

	@ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
	@Column({ type: DataType.STRING, allowNull: false })
	name: string

	@ApiProperty({ example: 'Иванов', description: 'Фамилия' })
	@Column({ type: DataType.STRING, allowNull: false })
	surname: string

	@ApiProperty({ example: 'admin@admin.com', description: 'Почтовый адрес' })
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	email: string

	@Column({ type: DataType.STRING, allowNull: false })
	password: string

	@ApiProperty({ example: 'true', description: 'Подтвержденный аккаунт или нет' })
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	isActivate: boolean

	@Column({ type: DataType.STRING })
	activationLink: string

	@Column({ type: DataType.STRING, defaultValue: null })
	resetPasswordToken: string

	@ApiProperty({ example: 'https://yurchuklinux.s3.amazonaws.com/%D0%A.png', description: 'Ссылка на фото' })
	@Column({ type: DataType.STRING, defaultValue: null })
	avatar: string

	@BelongsToMany(() => Role, () => UserRoles)
	roles: Role[]

	@HasMany(() => Posts)
	posts: Posts[]
}
