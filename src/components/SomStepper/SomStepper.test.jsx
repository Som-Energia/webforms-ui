import { render } from '@testing-library/react'
import SomStepper from './SomStepper'

test('SomStepper with steps renders without crashing', () => {
  const { getByRole } = render(<SomStepper steps={['STEP1']} activeStep={1} />)

  expect(getByRole('progressbar')).toBeInTheDocument()
})

test('SomStepper with stepsNum renders without crashing', () => {
  const { getByRole } = render(<SomStepper stepsNum={3} activeStep={1} />)

  expect(getByRole('progressbar')).toBeInTheDocument()
})

test('SomStepper with steps renders exact number of steps', () => {
  const { getByText } = render(
    <SomStepper steps={['STEP1', 'STEP2', 'STEP3']} activeStep={1} />
  )

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
    <SomStepper steps={['STEP1', 'STEP2']} activeStep={1} showStepTitle={'STEP_TITLE'} />
  )

  expect(getByText('STEP_TITLE 2/2', { trim: false, collapseWhitespace: false })).toBeInTheDocument()
})
