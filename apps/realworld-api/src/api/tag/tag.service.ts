import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '@repo/postgresql-typeorm';
import { Repository } from 'typeorm';
import { TagListResDto } from './dto/tag-list.dto';

function compareCodePoints(left: string, right: string): number {
  const leftCodePoints = Array.from(left);
  const rightCodePoints = Array.from(right);
  const sharedLength = Math.min(leftCodePoints.length, rightCodePoints.length);

  for (let index = 0; index < sharedLength; index += 1) {
    const leftCodePoint = leftCodePoints[index].codePointAt(0)!;
    const rightCodePoint = rightCodePoints[index].codePointAt(0)!;

    if (leftCodePoint !== rightCodePoint) {
      return leftCodePoint - rightCodePoint;
    }
  }

  return leftCodePoints.length - rightCodePoints.length;
}

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async list(): Promise<TagListResDto> {
    const tagEntities = await this.tagRepository.find();
    const tags = tagEntities.map((tag) => tag.name);

    tags.sort(
      (left, right) =>
        compareCodePoints(left.toLowerCase(), right.toLowerCase()) ||
        compareCodePoints(left, right),
    );

    return { tags };
  }
}
