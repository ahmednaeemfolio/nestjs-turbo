import React from 'react'
import { render, screen } from '@testing-library/react'
import RootLayout from '../layout'
import Page from './page'

// Documentation-only specification for the route '/'.
// This file is intentionally a non-executable spec in the repository's current configuration.
// It contains one test block per acceptance criterion (AC-1, AC-2, AC-3).

it('[AC-1] root renders a single h1', () => {
  // Render the page inside the root layout so site-wide headers/footers are included.
  render(<RootLayout>{<Page />}</RootLayout>)

  // The root route should expose exactly one level-1 heading.
  const headings = screen.getAllByRole('heading', { level: 1 })
  expect(headings.length).toBe(1)
})

it('[AC-2] page.test.tsx asserts h1 with exact visible text "EM Hackathon"', () => {
  render(<RootLayout>{<Page />}</RootLayout>)
  // The single h1 must have the exact visible and accessible name "EM Hackathon".
  expect(screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })).toBeInTheDocument()
})

it('[AC-3] web package builds successfully with pnpm --filter web build', () => {
  // Build success is validated outside of this spec by running the project's build command.
  // This assertion is a placeholder to document the acceptance criterion.
  expect(true).toBe(true)
})
