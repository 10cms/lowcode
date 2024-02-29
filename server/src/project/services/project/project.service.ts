import { CollectionDto, CollectionResponse } from "@forlagshuset/nestjs-mongoose-paginate";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ListQuery } from "src/lib/list-query";
import { ProjectMemberRole } from "src/project/schemas/project-member.schema";
import { Project, ProjectDocument, ProjectModel } from "src/project/schemas/project.schema";
import { UserDocument } from "src/user/schemas/user.schema";
import { ProjectMemberService } from "../project-member/project-member.service";

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: ProjectModel,
    private projectMemberService: ProjectMemberService
  ) {}
  
  async findById(id: string): Promise<ProjectDocument> {
    return await this.projectModel.findById(id).orFail();
  }

  async list(query: CollectionDto, user: UserDocument): Promise<CollectionResponse<ProjectDocument>> {
    const ids = await this.projectMemberService.listUserJoinedProjectIds(user);
    query.filter!._id = {
      $in: ids
    }
    const collector = new ListQuery<ProjectDocument>(this.projectModel);
    return collector.find(query);
  }
  
  async create(data: Partial<ProjectDocument>, user: UserDocument): Promise<ProjectDocument> {
    const project = new this.projectModel(data);
    await project.save();
    await this.projectMemberService.create(project, user, ProjectMemberRole.Admin)
    return project
  }
}
