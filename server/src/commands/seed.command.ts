import { Command, CommandRunner } from "nest-commander";
import { ProjectService } from "src/project/services/project/project.service";

@Command({
  name: 'seed',
})
export class SeedCommand extends CommandRunner {
  constructor (
    private readonly projectService: ProjectService
  ) {
    super();
  }

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log('Seeding...');

    // await this.projectService.create({
    //   name: 'Admin',
    //   slug: 'admin'
    // });
  }
}