import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: UserModel
  ) {}

  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    const user = new this.userModel(data);
    await user.save();
    return user
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).orFail();
  }

  createAccessToken (user: UserDocument) {
    const userId = user.id
    const payload = { sub: userId };
    return this.jwtService.sign(payload)
  }
}
