import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from '@repo/postgresql-typeorm';
import { Repository } from 'typeorm';
import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;
  let tagRepositoryValue: Partial<
    Record<keyof Repository<TagEntity>, jest.Mock>
  >;

  beforeEach(async () => {
    tagRepositoryValue = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: tagRepositoryValue,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns every tag name sorted without regard to case', async () => {
    tagRepositoryValue.find!.mockResolvedValue([
      { name: 'Zoo' } as TagEntity,
      { name: 'apple' } as TagEntity,
      { name: 'Banana' } as TagEntity,
      { name: 'apricot' } as TagEntity,
    ]);

    await expect(service.list()).resolves.toEqual({
      tags: ['apple', 'apricot', 'Banana', 'Zoo'],
    });
    expect(tagRepositoryValue.find).toHaveBeenCalledTimes(1);
  });

  it('orders case-only ties deterministically across repository input orders', async () => {
    const find = tagRepositoryValue.find!;
    find
      .mockResolvedValueOnce(
        ['beta', 'alpha', 'Beta', 'ALPHA', 'Alpha'].map(
          (name) => ({ name }) as TagEntity,
        ),
      )
      .mockResolvedValueOnce(
        ['Alpha', 'ALPHA', 'Beta', 'alpha', 'beta'].map(
          (name) => ({ name }) as TagEntity,
        ),
      );

    const expected = {
      tags: ['ALPHA', 'Alpha', 'alpha', 'Beta', 'beta'],
    };

    await expect(service.list()).resolves.toEqual(expected);
    expect(find).toHaveBeenCalledTimes(1);

    await expect(service.list()).resolves.toEqual(expected);
    expect(find).toHaveBeenCalledTimes(2);
  });

  it('returns an empty tag list when no tags are found', async () => {
    tagRepositoryValue.find!.mockResolvedValue([]);

    await expect(service.list()).resolves.toEqual({ tags: [] });
    expect(tagRepositoryValue.find).toHaveBeenCalledTimes(1);
  });
});
