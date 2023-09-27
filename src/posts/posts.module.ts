import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { FileModule } from 'src/file/file.module'
import { User } from 'src/user/models/user.model'
import { Posts } from './models/posts.model'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'

@Module({
	imports: [AuthModule, FileModule, SequelizeModule.forFeature([User, Posts])],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}
