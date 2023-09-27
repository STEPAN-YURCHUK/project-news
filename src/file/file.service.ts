import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FileService {
	private readonly s3Client: S3Client

	constructor() {
		this.s3Client = new S3Client({
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},
		})
	}

	async uploadFile(file: { originalname: any; buffer: any }) {
		const uploadParams = {
			Bucket: process.env.AWS_BUCKET,
			Key: file.originalname,
			Body: file.buffer,
			ACL: 'public-read',
			ContentType: 'image/png',
		}

		const uploadCommand = new PutObjectCommand(uploadParams)

		try {
			await this.s3Client.send(uploadCommand)
			return { url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${file.originalname}` }
		} catch (error) {
			throw new Error(`Ошибка загрузки файла в S3: ${error.message}`)
		}
	}

	async deleteFile(key: string) {
		const deleteParams = {
			Bucket: process.env.AWS_BUCKET,
			Key: key,
		}

		const deleteCommand = new DeleteObjectCommand(deleteParams)

		try {
			await this.s3Client.send(deleteCommand)
			return { message: 'Файл успешно удален из S3.' }
		} catch (error) {
			throw new Error(`Ошибка удаления файла из S3: ${error.message}`)
		}
	}
}
