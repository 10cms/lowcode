import {JSONSchemaType} from "ajv"
import { Injectable } from '@nestjs/common';
import { ValidationPipe } from "src/pipes/validation.pipe";
import { User, UserDocument } from "src/user/schemas/user.schema";
import { ProjectMemberRole } from "../schemas/project-member.schema";

export interface CreateProjectMemberDto {
  role: ProjectMemberRole
  user: UserDocument
}

@Injectable()
export class CreateProjectMemberPipe extends ValidationPipe<CreateProjectMemberDto> {
  protected schema: JSONSchemaType<CreateProjectMemberDto & { user: string }> = {
    type: "object",
    $async: true,
    properties: {
      role: { type: "string", enum: Object.values(ProjectMemberRole)},
      user: { type: "string", format: "objectId",
        existInDb: {
          model: User.name,
          modify: true
        }
      },
    },
    required: ["role", "user"]
    
  }
}