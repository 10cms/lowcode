import { ProjectDocument } from "./project/schemas/project.schema";

export interface FindOneEntityFilter {
  project: ProjectDocument,
  slug: string
}