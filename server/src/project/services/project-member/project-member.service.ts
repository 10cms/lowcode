import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { ProjectMember, ProjectMemberModel, ProjectMemberRole } from 'src/project/schemas/project-member.schema';
import { ProjectDocument } from 'src/project/schemas/project.schema';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectModel(ProjectMember.name) private projectMemberModel: ProjectMemberModel
  ) {}
  
  async create(project: ProjectDocument, user: UserDocument, role: ProjectMemberRole): Promise<ProjectMember> {
    const projectMember = new this.projectMemberModel({
      project,
      user,
      role
    });

    return await projectMember.save();
  }

  async listUserJoinedProjectIds(user: UserDocument): Promise<ObjectId[]> {
    const projectMembers = await this.projectMemberModel.find({ user }).select('project').exec();
    return projectMembers.map(tm => tm.project as unknown as ObjectId);
  }

  async getRelation(project: ProjectDocument | string, user: UserDocument): Promise<ProjectMember | null> {
    return await this.projectMemberModel.findOne({
      project,
      user
    })
  }

  async isAdmin(project: ProjectDocument, user: UserDocument): Promise<boolean> {
    return !! await this.projectMemberModel.exists({
      project,
      user,
      role: ProjectMemberRole.Admin
    });
  }

  async isMember(project: ProjectDocument, user: UserDocument): Promise<boolean> {
    return !! await this.projectMemberModel.exists({
      project,
      user
    });
  }

  async remove(project: ProjectDocument, user: UserDocument) {
    return await this.projectMemberModel.deleteOne({
      project,
      user
    })
  }
}
