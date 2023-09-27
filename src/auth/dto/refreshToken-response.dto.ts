import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/user/models/user.model'

class AccessAndRefreshTokenDto {
	@ApiProperty({ description: 'JWT токен доступа' })
	access_token: string

	@ApiProperty({ description: 'JWT токен обновления' })
	refresh_token: string
}

export class RefreshTokenResponseDto {
	@ApiProperty({ description: 'Пользователь', type: User })
	user: User

	@ApiProperty({ description: 'JWT токены доступа и обновления', type: AccessAndRefreshTokenDto })
	token: AccessAndRefreshTokenDto
}
