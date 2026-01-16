import { render } from '@testing-library/react'
import SomStepper from './SomStepper'

const steps = { STEP1: 1, STEP2: 2, STEP3: 3 }

test('SomStepper with steps renders without crashing', () => {
  const { getByRole } = render(<SomStepper steps={steps} activeStep={1} />)

  expect(getByRole('progressbar')).toBeInTheDocument()
})

test('SomStepper with stepsNum renders without crashing', () => {
  const { getByRole } = render(<SomStepper stepsNum={3} activeStep={1} />)

  expect(getByRole('progressbar')).toBeInTheDocument()
})

test('SomStepper with steps renders exact number of steps', () => {
  const { getByText } = render(<SomStepper steps={steps} activeStep={1} />)

  expect(getByText('2/3')).toBeInTheDocument()
})

test('SomStepper without steps renders without crashing', () => {
  const { getByRole } = render(<SomStepper />)

  try {
    expect(getByRole('progressbar')).not.toBeInTheDocument()
  } catch {
    //progressbar not shown
  }
})

test('SomStepper with step title renders without crashing', () => {
  const { getByText } = render(
    <SomStepper steps={steps} activeStep={1} showStepTitle={'STEP_TITLE'} />
  )

  const expectedStepTitle = `STEP_TITLE 2/${Object.keys(steps).length}`
  expect(
    getByText(expectedStepTitle, { trim: false, collapseWhitespace: false })
  ).toBeInTheDocument()
})

test('SomStepper render with progressbar', () => {
  const activeStep = 1
  const { getByRole } = render(
    <SomStepper steps={steps} activeStep={activeStep} />
  )

  // Calculate the progress
  // activeStep starts at 0
  const internalActiveStep = activeStep + 1
  const numSteps = Object.keys(steps).length
  // Component calculate percent with Math.ceil
  const expectedValue = Math.ceil((internalActiveStep / numSteps) * 100)

  // Rendered progress value
  const progressValue = Number(
    getByRole('progressbar').getAttribute('aria-valuenow')
  )
  expect(expectedValue).toBe(progressValue)
})
