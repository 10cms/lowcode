import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedCommand } from './commands/seed.command';
import { AcceptLanguageResolver, CookieResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { UserModule } from './user/user.module';
import { MongodbModule } from './mongodb/mongodb.module';
import { ProjectModule } from './project/project.module';
import { ResourceModule } from './resource/resource.module';
import { PageModule } from './page/page.module';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/')
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new CookieResolver(),
        AcceptLanguageResolver
      ],
    }),
    UserModule,
    MongodbModule,
    ProjectModule,
    ResourceModule,
    PageModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedCommand
  ],
})
export class AppModule {}
