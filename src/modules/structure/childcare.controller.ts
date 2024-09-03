import { Body, Controller, Delete, Get, Headers, Param, Post, UnauthorizedException } from "@nestjs/common";
import { ChildcareService } from "./childcare.service";
import { Childcare } from "./childcare.entity";

@Controller()
export class ChildcareController {
  constructor(private readonly childcareService: ChildcareService) {}

  @Get('/child-cares')
  async listChildcares(): Promise<Childcare[]> {
    return this.childcareService.findAll();
  }

  @Post('/child-care')
  async createChildcare(
    @Headers('X-Auth') username: string,
    @Body('name') name: string,
  ): Promise<Childcare> {
    if (!username) {
      throw new UnauthorizedException('Missing X-Auth header');
    }

    return this.childcareService.createChildcare(name, username);
  }

  @Delete('/child-care/:id')
  async deleteChildcare(
    @Headers('X-Auth') username: string,
    @Param('id') id: number,
  ): Promise<void> {
    if (!username) {
      throw new UnauthorizedException('Missing X-Auth header');
    }

    return this.childcareService.deleteChildcare(id, username);
  }
}