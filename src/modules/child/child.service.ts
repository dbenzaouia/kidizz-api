import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildcareService } from '../structure/childcare.service';
import { UserService } from '../user/user.service';
import { Child } from './child.entity';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @Inject(forwardRef(() => ChildcareService))
    private readonly childcareService: ChildcareService,
    private readonly userService: UserService,
  ) {}

  async findChildrenByChildcare(childcareId: number): Promise<Child[]> {
    return this.childRepository.createQueryBuilder('child')
    .innerJoinAndSelect('child.childcares', 'childcare', 'childcare.id = :childcareId', { childcareId })
    .innerJoinAndSelect('child.creator', 'creator')
    .getMany();
  }

  async createChild(firstName: string, lastName: string, username: string, childcareId: number): Promise<Child> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username provided');
    }

    let child = await this.childRepository.findOne({
      where: { firstName, lastName },
      relations: ['childcares'], 
    });

    if (child) {
      // Child exists, update childcareIds
      if (!child.childcares.some(childcare => childcare.id === childcareId)) {
        child.childcares.push(await this.childcareService.findById(childcareId));
        child = await this.childRepository.save(child);
      }
    } else {
      // Child does not exist, create a new one
      const childcares = await this.childcareService.findByIds([childcareId]);
      child = this.childRepository.create({ firstName, lastName, creator: user, childcares });
      child = await this.childRepository.save(child);
    }


    return child;
  }

  async deleteChildAssignment(childcareId: number, childId: number, username: string): Promise<void> {
    const child = await this.childRepository.findOne({ where: { id: childId }, relations: ['childcares', 'creator'] });

    if (!child) {
      throw new NotFoundException('Child not found');
    }
    console.log("child", child.creator)

    if (child.creator.username !== username) {
      throw new UnauthorizedException('You are not authorized to remove this child assignment');
    }

    const childcare = child.childcares?.find(c => c.id == childcareId);
    if (!childcare) {
      throw new NotFoundException('This child is not assigned to the specified creche');
    }

    child.childcares = child?.childcares?.filter(c => c.id != childcareId);

    if (child.childcares?.length === 0) {
      await this.childRepository.remove(child); 
    } else {
      await this.childRepository.save(child);
    }
  }

  async findAllChildren(): Promise<Child[]> {
    return this.childRepository
      .createQueryBuilder('child')
      .orderBy('child.lastName', 'ASC')
      .getMany();
  }

}
