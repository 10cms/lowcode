import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import './mongoose.plugin';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: process.env.MONGO_URL || 
            'mongodb://root:root@mongo:27017/app?authSource=admin',
        }
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class MongodbModule {}