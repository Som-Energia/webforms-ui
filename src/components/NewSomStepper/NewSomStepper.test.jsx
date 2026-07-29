import { render } from '@testing-library/react'
import NewSomStepper from './NewSomStepper'
import { initI18n } from '../../tests/i18n.mock'
import { expect } from 'vitest'

const steps = [
  <div key={0}>HELLO</div>,
  <div key={1}>DARLING</div>,
  <div key={2}>BYE</div>
]

describe('SomStepper component ', async () => {
  // avoid warnings
  await initI18n()

  describe('SomStepper with steps', () => {
    test('SomStepper renders', () => {
      const { queryByRole } = render(
        <NewSomStepper steps={steps} activeStep={0} />
      )

      expect(queryByRole('progressbar')).toBeInTheDocument()
    })

    test('SomStepper renders exact number of steps', () => {
      const { queryByText } = render(
        <NewSomStepper steps={steps} activeStep={1} />
      )

      const expectedText = `2/${steps.length}`
      expect(queryByText(expectedText)).toBeInTheDocument()
    })

    test('SomStepper limit the max steps number when overflow activeStep', () => {
      const { queryByText } = render(
        <NewSomStepper steps={steps} activeStep={99} />
      )

      const expectedText = `${steps.length}/${steps.length}`
      expect(queryByText(expectedText)).toBeInTheDocument()
    })

    test('SomStepper with step title renders without crashing', () => {
      const { queryByText } = render(
        <NewSomStepper
          steps={steps}
          activeStep={1}
          showStepTitle={'STEP_TITLE'}
        />
      )

      const expectedStepTitle = `STEP_TITLE 2/${steps.length}`
      expect(
        queryByText(expectedStepTitle, {
          trim: false,
          collapseWhitespace: false
        })
      ).toBeInTheDocument()
    })

    test('SomStepper renders with progressbar', () => {
      const activeStep = 1
      const { queryByRole } = render(
        <NewSomStepper steps={steps} activeStep={activeStep} />
      )

      // Calculate the progress
      // activeStep starts at 0
      const internalActiveStep = activeStep + 1
      const numSteps = steps.length
      // Component calculate percent with Math.ceil
      const expectedValue = Math.ceil((internalActiveStep / numSteps) * 100)

      // Rendered progress value
      const progressValue = Number(
        queryByRole('progressbar').getAttribute('aria-valuenow')
      )
      expect(expectedValue).toBe(progressValue)
    })
  })

  describe('SomStepper without steps', () => {
    test('SomStepper renders', () => {
      const { queryByRole } = render(<NewSomStepper />)
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    })
    test('SomStepper without the steps progressbar header', () => {
      const { queryByText } = render(
        <NewSomStepper showStepProgress={false}>Content</NewSomStepper>
      )
      expect(queryByText('STEP_TITLE')).not.toBeInTheDocument()
    })
  })
})
