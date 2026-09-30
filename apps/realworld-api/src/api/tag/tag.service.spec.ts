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

  beforeAll(async () => {
    tagRepositoryValue = {
      find: jest.fn(),
    };
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

  beforeEach(() => {
    tagRepositoryValue.find?.mockReset();
    tagRepositoryValue.find?.mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns every tag name in case-insensitive alphabetical order', async () => {
    tagRepositoryValue.find?.mockResolvedValue([
      { name: 'zebra' },
      { name: 'beta' },
      { name: 'apple' },
      { name: 'Alpha' },
    ]);

    await expect(service.list()).resolves.toEqual({
      tags: ['Alpha', 'apple', 'beta', 'zebra'],
    });
    expect(tagRepositoryValue.find).toHaveBeenCalledTimes(1);
  });

  it('orders case-only ties deterministically regardless of repository order', async () => {
    const inputs = [
      ['alpha', 'ALPHA', 'Alpha'],
      ['Alpha', 'alpha', 'ALPHA'],
    ];

    for (const names of inputs) {
      tagRepositoryValue.find?.mockClear();
      tagRepositoryValue.find?.mockResolvedValue(
        names.map((name) => ({ name })),
      );

      await expect(service.list()).resolves.toEqual({
        tags: ['ALPHA', 'Alpha', 'alpha'],
      });
      expect(tagRepositoryValue.find).toHaveBeenCalledTimes(1);
    }
  });

  it('returns an empty tag list when the repository has no tags', async () => {
    tagRepositoryValue.find?.mockResolvedValue([]);

    await expect(service.list()).resolves.toEqual({ tags: [] });
    expect(tagRepositoryValue.find).toHaveBeenCalledTimes(1);
  });
});
