import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from '@repo/postgresql-typeorm';
import { Repository } from 'typeorm';
import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;
  let findMock: jest.Mock;
  let tagRepositoryValue: Partial<
    Record<keyof Repository<TagEntity>, jest.Mock>
  >;

  const createTags = (...names: string[]): TagEntity[] =>
    names.map((name) => ({ name }) as TagEntity);

  beforeAll(async () => {
    tagRepositoryValue = { find: jest.fn() };
    findMock = tagRepositoryValue.find!;

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
    findMock.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns all tag names in case-insensitive alphabetical order', async () => {
    findMock.mockResolvedValue(createTags('python', 'JavaScript', 'Go'));

    await expect(service.list()).resolves.toEqual({
      tags: ['Go', 'JavaScript', 'python'],
    });
    expect(findMock).toHaveBeenCalledTimes(1);
  });

  it('orders case-only ties deterministically regardless of repository input order', async () => {
    findMock.mockResolvedValue(createTags('tag', 'Tag', 'TAG'));

    await expect(service.list()).resolves.toEqual({
      tags: ['TAG', 'Tag', 'tag'],
    });
    expect(findMock).toHaveBeenCalledTimes(1);

    findMock.mockClear();
    findMock.mockResolvedValue(createTags('TAG', 'tag', 'Tag'));

    await expect(service.list()).resolves.toEqual({
      tags: ['TAG', 'Tag', 'tag'],
    });
    expect(findMock).toHaveBeenCalledTimes(1);
  });

  it('returns an empty tag list when the repository has no tags', async () => {
    findMock.mockResolvedValue([]);

    await expect(service.list()).resolves.toEqual({ tags: [] });
    expect(findMock).toHaveBeenCalledTimes(1);
  });
});
