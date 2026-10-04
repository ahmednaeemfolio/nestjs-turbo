import React from 'react'
import { render, screen } from '@testing-library/react'
import Page from './page'

it('[AC-1]', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })).toBeInTheDocument()
})

it('[AC-2]', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })).toBeInTheDocument()
})

it('[AC-3]', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })).toBeInTheDocument()
})
