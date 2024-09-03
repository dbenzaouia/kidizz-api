import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  Query,
  Res,
} from '@nestjs/common';
import { ChildService } from './child.service';
import { Child } from './child.entity';
import * as fastCsv from 'fast-csv';
import { Response } from 'express';

@Controller()
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Get('/child-care/:id/children')
  async listChildren(@Param('id') childcareId: string): Promise<Child[]> {
    return this.childService.findChildrenByChildcare(parseInt(childcareId));
  }

  @Post('/child')
  async createChild(
    @Headers('X-Auth') username: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('childcareId') childcareId: string,
  ): Promise<Child> {
    if (!username) {
      throw new UnauthorizedException('Missing X-Auth header');
    }

    return this.childService.createChild(
      firstname,
      lastname,
      username,
      parseInt(childcareId),
    );
  }

  @Delete('/child-care/:childcareId/child/:childId')
  async deleteChildAssignment(
    @Headers('X-Auth') username: string,
    @Param('childcareId') childcareId: number,
    @Param('childId') childId: number,
  ): Promise<void> {
    if (!username) {
      throw new UnauthorizedException('Missing X-Auth header');
    }

    return this.childService.deleteChildAssignment(
      childcareId,
      childId,
      username,
    );
  }

  @Get('/children/export.csv')
  async exportChildren(
    @Res() res: Response,
    @Query('childCareId') childCareId?: number,
  ) {
    const children = childCareId
      ? await this.childService.findChildrenByChildcare(childCareId)
      : await this.childService.findAllChildren();

    res.setHeader('Content-Disposition', 'attachment; filename=children.csv');
    res.setHeader('Content-Type', 'text/csv');

    const csvStream = fastCsv.format({ headers: true });
    csvStream.pipe(res);

    children
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .forEach((child) => {
        csvStream.write({
          Prenom: child.firstName,
          Nom: child.lastName,
        });
      });

    csvStream.end();
  }
}
