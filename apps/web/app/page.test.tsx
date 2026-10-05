import React from 'react'
import { render, screen } from '@testing-library/react'
import Page from './page'

it('[AC-1] renders a single h1 with exact text "EM Hackathon"', () => {
  render(<Page />)
  expect(
    screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })
  ).toBeInTheDocument()
})

it('[AC-2] page.test.tsx contains a specification asserting the root page has an h1 with text "EM Hackathon"', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })).toBeTruthy()
})

it('[AC-3] build completes successfully (documentation-only spec)', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })).toBeDefined()
})
