import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { AuthService } from 'src/auth/auth.service'
import { FileService } from 'src/file/file.service'
import { CreatePostDto } from './dto/create.post.dto'
import { Posts } from './models/posts.model'

@Injectable()
export class PostsService {
	constructor(@InjectModel(Posts) private postsRepository: typeof Posts, private authService: AuthService, private fileService: FileService) {}

	async createPost(token: string, dto: CreatePostDto, file: any) {
		const id = (await this.authService.decodeToken(token)).id
		if (!file) {
			const post = await this.postsRepository.create({ ...dto, userId: id })
			const postResponse = {
				id: post.id,
				title: post.title,
				content: post.content,
				image: post.image,
				userId: post.userId,
			}
			return postResponse
		}
		const url = (await this.fileService.uploadFile(file)).url

		const post = await this.postsRepository.create({ ...dto, userId: id, image: url })

		const postResponse = {
			id: post.id,
			title: post.title,
			content: post.content,
			image: post.image,
			userId: post.userId,
		}

		return postResponse
	}

	async updatePost(token: string, id: number, dto: CreatePostDto, file: any) {
		const userId = (await this.authService.decodeToken(token)).id
		const post = await this.postsRepository.findByPk(id)
		if (post.userId !== userId) {
			throw new ForbiddenException('У вас нет прав на изменение этого поста')
		}
		if (!post) {
			throw new NotFoundException('Пост не найден')
		}

		if (file) {
			if (post.image) {
				await this.fileService.deleteFile(post.image.split('/')[3])
			}
			const url = await (await this.fileService.uploadFile(file)).url
			post.image = url
		}
		if (dto.title) {
			post.title = dto.title
		}
		if (dto.content) {
			post.content = dto.content
		}
		post.save()
		const responsePost = {
			id: post.id,
			title: post.title,
			content: post.content,
			image: post.image,
			userId: post.userId,
		}

		return responsePost
	}

	async getAllPosts() {
		const posts = await this.postsRepository.findAll({ attributes: ['id', 'title', 'content', 'image', 'userId'] })
		if (!posts) {
			throw new HttpException('Посты не найдены', HttpStatus.NO_CONTENT)
		}
		return posts
	}

	async getOnePostById(id: number) {
		const post = await this.postsRepository.findByPk(id, { attributes: ['id', 'title', 'content', 'image', 'userId'] })
		if (!post) {
			throw new NotFoundException('Пост не найден')
		}
		return post
	}

	async getAllPostsByUserId(id: number) {
		const posts = await this.postsRepository.findAll({ where: { userId: id }, attributes: ['id', 'title', 'content', 'image', 'userId'] })
		if (!posts) {
			throw new HttpException('Посты не найдены', HttpStatus.NO_CONTENT)
		}
		return posts
	}

	async deleteOnePost(id: number) {
		const post = await this.getOnePostById(id)
		if (!post) {
			throw new NotFoundException('Пост не найден')
		}
		await post.destroy()
		return { message: 'Пост удален успешно' }
	}
}
