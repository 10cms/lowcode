import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schemas/user.schema';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: 'JWT_SECRET',
            signOptions: { expiresIn: '30d' },
          })
        })
      ],
      providers: [
        UserService,
        {
          provide: 'UserModel',
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create user access token should successfully', () => {
    const user = {
      id: 'id',
    } as UserDocument

    const accessToken = service.createAccessToken(user)
    expect(accessToken).not.toBeNull()
    expect(typeof accessToken).toBe('string')
  });
});
