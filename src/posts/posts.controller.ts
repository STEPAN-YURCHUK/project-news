import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger' // Импортируйте необходимые декораторы Swagger
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CreatePostDto } from './dto/create.post.dto'
import { Posts } from './models/posts.model'
import { PostsService } from './posts.service'

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
	constructor(private postService: PostsService) {}

	@UseInterceptors(FileInterceptor('file'))
	@ApiSecurity('JWT-auth')
	@ApiBody({ type: CreatePostDto })
	@ApiOperation({ summary: 'Создать пост' })
	@ApiResponse({ status: 201, description: 'Пост успешно создан', type: Posts })
	@UseGuards(JwtAuthGuard)
	@Post()
	createPost(@Body() dto: CreatePostDto, @UploadedFile() file, @Req() req) {
		const token = req.headers.authorization.split(' ')[1]
		return this.postService.createPost(token, dto, file)
	}

	@ApiOperation({ summary: 'Получить все посты' })
	@Get()
	@ApiResponse({ status: 200, description: 'Список постов', type: [Posts] })
	getAllPosts() {
		return this.postService.getAllPosts()
	}

	@ApiOperation({ summary: 'Получить пост по ID' })
	@ApiResponse({ status: 200, description: 'Пост', type: Posts })
	@Get(':id')
	getOnePostById(@Param('id') id: number) {
		return this.postService.getOnePostById(id)
	}

	@ApiOperation({ summary: 'Удалить пост по ID' })
	@ApiSecurity('JWT-auth')
	@ApiResponse({ status: 200, description: 'Пост успешно удален' })
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteOnePost(@Param('id') id: number) {
		return this.postService.deleteOnePost(id)
	}
}
