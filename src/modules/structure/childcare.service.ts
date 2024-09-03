import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Childcare } from "./childcare.entity";
import { In, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { ChildService } from "../child/child.service";
import { User } from "../user/user.entity";

@Injectable()
export class ChildcareService {
  constructor(
    @InjectRepository(Childcare)
    private childcareRepository: Repository<Childcare>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ChildService))
    private readonly childService: ChildService,
  ) {}

  async findAll(): Promise<Childcare[]> {
    return this.childcareRepository.find();
  }

  async findById(id: number): Promise<Childcare> {
    const childcare = await this.childcareRepository.findOne({ where: { id } });
    if (!childcare) {
      throw new NotFoundException('Childcare not found');
    }
    return childcare;
  }

  async findByIds(ids: number[]): Promise<Childcare[]> {
    return this.childcareRepository.findBy({id: In(ids)});
  }

  async createChildcare(name: string, username: string): Promise<Childcare> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username provided');
    }

    const childcare = this.childcareRepository.create({ name, creator: user });
    return this.childcareRepository.save(childcare);
  }

  async deleteChildcare(id: number, username: string): Promise<void> {
    const childcare = await this.childcareRepository.findOne({ where: { id } });

    if (!childcare) {
      throw new NotFoundException('Structure not found');
    }

    if (childcare?.creator?.username !== username) {
      throw new UnauthorizedException('You are not authorized to delete this creche');
    }

    const children = await this.childService.findChildrenByChildcare(id);

    const usersToInform = new Set<User>();
    for (const child of children) {
      if (child.creator.username !== username) {
        usersToInform.add(child.creator);
      }
    }


    await this.childcareRepository.delete(id);
    this.informUsers([...usersToInform]);
  }

  private async informUsers(users: User[]): Promise<void> {
    const emailPromises = users.map(user => this.informStructureDeletion(user.email));

    for (let i = 0; i < emailPromises.length; i += 3) {
      await Promise.all(emailPromises.slice(i, i + 3));
    }
  }

  private informStructureDeletion(userEmail: string): Promise<void> {
    const secondsToWait = Math.trunc(Math.random() * 7) + 1;
  
    return new Promise<void>(resolve => {
      setTimeout(() => {
        console.log(userEmail, 'informed!');
        resolve();
      }, secondsToWait * 1000);
    });
  }
}