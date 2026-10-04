import { isValidElement, type ReactElement, type ReactNode } from 'react';
import Home from './page';

type RoleOptions = {
  level: number;
  name: string;
};

function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textContent).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textContent(node.props.children);
  }

  return '';
}

function renderHomepage() {
  const root = Home();

  return {
    getByRole(role: 'heading', options: RoleOptions): ReactElement {
      const matches: ReactElement[] = [];

      function visit(node: ReactNode) {
        if (Array.isArray(node)) {
          node.forEach(visit);
          return;
        }

        if (!isValidElement<{ children?: ReactNode }>(node)) {
          return;
        }

        if (
          role === 'heading' &&
          node.type === `h${options.level}` &&
          textContent(node.props.children) === options.name
        ) {
          matches.push(node);
        }

        visit(node.props.children);
      }

      visit(root);

      if (matches.length !== 1) {
        throw new Error(`Expected one ${role} named ${options.name}`);
      }

      return matches[0];
    },
  };
}

it('[AC-1] renders the exact visible homepage heading', () => {
  const { getByRole } = renderHomepage();
  const heading = getByRole('heading', { level: 1, name: 'EM Hackathon' });

  expect(textContent(heading.props.children)).toBe('EM Hackathon');
});

it('[AC-2] exposes the exact accessible homepage heading', () => {
  const { getByRole } = renderHomepage();

  expect(
    getByRole('heading', { level: 1, name: 'EM Hackathon' }),
  ).toBeDefined();
});

it('[AC-3] renders the homepage synchronously for production builds', () => {
  const { getByRole } = renderHomepage();

  expect(() =>
    getByRole('heading', { level: 1, name: 'EM Hackathon' }),
  ).not.toThrow();
});
