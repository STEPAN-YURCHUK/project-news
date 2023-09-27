import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { AuthService } from 'src/auth/auth.service'
import { FileService } from 'src/file/file.service'
import { CreatePostDto } from './dto/create.post.dto'
import { Posts } from './models/posts.model'

@Injectable()
export class PostsService {
	constructor(@InjectModel(Posts) private postsRepository: typeof Posts, private authService: AuthService, private fileService: FileService) {}

	async createPost(token: string, dto: CreatePostDto, file: any) {
		console.log(dto)
		const id = (await this.authService.decodeToken(token)).id
		const url = (await this.fileService.uploadFile(file)).url
		const post = await this.postsRepository.create({ ...dto, userId: id, image: url })
		return post
	}

	async getAllPosts() {
		return await this.postsRepository.findAll()
	}

	async getOnePostById(id: number) {
		return this.postsRepository.findByPk(id)
	}

	async deleteOnePost(id: number) {
		const post = await this.getOnePostById(id)
		await post.destroy()
		return { message: 'Пост удален успешно' }
	}
}
