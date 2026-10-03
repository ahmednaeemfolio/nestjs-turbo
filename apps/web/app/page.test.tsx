// @ts-nocheck
import { Children, isValidElement } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Home from './page';

function nativeElements(node: unknown, tagName: string): Array<any> {
  if (!isValidElement(node)) return [];

  const current = node.type === tagName ? [node] : [];
  const descendants = Children.toArray(node.props.children).flatMap((child) =>
    nativeElements(child, tagName),
  );

  return [...current, ...descendants];
}

function textContent(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!isValidElement(node)) return '';

  return Children.toArray(node.props.children).map(textContent).join('');
}

describe('[AC-1][AC-2][AC-3][AC-4][AC-5] web root-page specification', () => {
  it('[AC-1][AC-3] exposes exactly one visible native level-1 heading named EM Hackathon', () => {
    const headings = nativeElements(Home(), 'h1');

    expect(headings).toHaveLength(1);
    expect(textContent(headings[0])).toBe('EM Hackathon');
    expect(headings[0].props).not.toHaveProperty('aria-hidden');
    expect(headings[0].props).not.toHaveProperty('hidden');
    expect(headings[0].props).not.toHaveProperty('style');
    expect(headings[0].props).not.toHaveProperty('className');
  });

  it('[AC-2] limits the page update to an unstyled DOM insertion while retaining existing content and interactions', () => {
    const page = Home();
    const copy = textContent(page);
    const links = nativeElements(page, 'a');

    expect(copy).toContain('Get started by editing app/page.tsx');
    expect(copy).toContain('Save and see your changes instantly.');
    expect(copy).toContain('Deploy now');
    expect(copy).toContain('Read our docs');
    expect(copy).toContain('Open alert');
    expect(copy).toContain('Learn');
    expect(copy).toContain('Examples');
    expect(copy).toContain('Go to nextjs.org →');
    expect(links).toHaveLength(5);
    expect(links.every((link) => link.props.target === '_blank')).toBe(true);
  });

  it('[AC-4] preserves the production build command for build compatibility', () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    );

    expect(packageJson.scripts.build).toBe('next build');
  });

  it('[AC-5] keeps changed-file and test-runner configuration expectations local to the web package', () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    );
    const jestConfig = readFileSync(
      join(process.cwd(), 'jest.config.js'),
      'utf8',
    );

    expect(packageJson.scripts.test).toContain('jest.config.js');
    expect(jestConfig).toContain('<rootDir>/jest.setup.ts');
    expect(jestConfig).toContain('@swc/jest');
    expect(jestConfig).not.toContain('ts-jest');
  });
});
