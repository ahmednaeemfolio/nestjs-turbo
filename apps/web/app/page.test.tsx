import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import Home from './page';

type ElementProps = {
  'aria-label'?: string;
  children?: ReactNode;
};

function visibleText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (!isValidElement<ElementProps>(node)) {
    return '';
  }

  return Children.toArray(node.props.children).map(visibleText).join('');
}

function accessibleName(element: ReactElement<ElementProps>): string {
  return element.props['aria-label'] ?? visibleText(element.props.children);
}

function getByRole(
  node: ReactNode,
  role: 'heading',
  options: { level: number; name: string },
): ReactElement<ElementProps> {
  if (isValidElement<ElementProps>(node)) {
    const headingLevel =
      typeof node.type === 'string' && /^h[1-6]$/.test(node.type)
        ? Number(node.type.slice(1))
        : undefined;

    if (
      role === 'heading' &&
      headingLevel === options.level &&
      accessibleName(node) === options.name
    ) {
      return node;
    }

    for (const child of Children.toArray(node.props.children)) {
      try {
        return getByRole(child, role, options);
      } catch {
        // Continue searching the remaining descendants.
      }
    }
  }

  throw new Error(
    `Unable to find role ${role} at level ${options.level} named ${options.name}`,
  );
}

describe('Home', () => {
  it('[AC-1] renders the exact visible page heading', () => {
    const heading = getByRole(Home(), 'heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.type).toBe('h1');
    expect(visibleText(heading.props.children)).toBe('EM Hackathon');
  });

  it('[AC-2] exposes the exact accessible heading name', () => {
    const heading = getByRole(Home(), 'heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(accessibleName(heading)).toBe('EM Hackathon');
  });

  it('[AC-3] keeps the synchronous homepage render verifiable', () => {
    expect(() =>
      getByRole(Home(), 'heading', { level: 1, name: 'EM Hackathon' }),
    ).not.toThrow();
  });
});
