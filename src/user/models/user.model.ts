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

	@ApiProperty({ example: 'admin@admin.com', description: 'Почтовый адрес' })
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	email: string

	@ApiProperty({ example: '12345678', description: 'Пароль' })
	@Column({ type: DataType.STRING, allowNull: false })
	password: string

	@ApiProperty({ example: 'true', description: 'Подтвержденный аккаунт или нет' })
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	isActivate: boolean

	@ApiProperty({ example: 'iuwqrwoqmfw', description: 'Ссылка на активацию' })
	@Column({ type: DataType.STRING })
	activationLink: string

	@ApiProperty({ example: '43b23on23', description: 'Токен восстановление пароля' })
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
