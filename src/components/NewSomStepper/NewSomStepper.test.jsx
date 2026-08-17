import { useState } from "react"

import { fireEvent, render, screen } from "@testing-library/react"
import { expect, vi } from "vitest"

import { initI18n } from "../../tests/i18n.mock"
import NewSomStepper from "./NewSomStepper"

const steps = [
  <div key={0}>HELLO</div>,
  <div key={1}>DARLING</div>,
  <div key={2}>BYE</div>,
]

const StepperWrapper = ({ initialStep = 0, ...props }) => {
  const [activeStep, setActiveStep] = useState(initialStep)

  return (
    <NewSomStepper
      steps={steps}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      disableNext={false}
      {...props}
    />
  )
}

describe("SomStepper component ", async () => {
  // avoid warnings
  await initI18n()

  const renderStepper = (props = {}) => {
    const setActiveStep = props.setActiveStep ?? vi.fn()

    return {
      setActiveStep,
      ...render(
        <NewSomStepper
          steps={steps}
          activeStep={0}
          setActiveStep={setActiveStep}
          {...props}
        />,
      ),
    }
  }

  describe("SomStepper with steps", () => {
    test("SomStepper renders", () => {
      renderStepper()

      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })

    test("SomStepper renders exact number of steps", () => {
      renderStepper({ activeStep: 1 })

      const expectedText = `2/${steps.length}`
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })

    test("SomStepper limit the max steps number when overflow activeStep", () => {
      renderStepper({ activeStep: 99 })

      const expectedText = `${steps.length}/${steps.length}`
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })

    test("SomStepper renders the step title when enabled", () => {
      renderStepper({ activeStep: 1, showStepTitle: true })

      const expectedStepTitle = `STEP_TITLE 2/${steps.length}`
      expect(
        screen.getByText(expectedStepTitle, {
          trim: false,
          collapseWhitespace: false,
        }),
      ).toBeInTheDocument()
    })

    test("SomStepper renders a custom step title key when provided", () => {
      renderStepper({
        activeStep: 1,
        showStepTitle: true,
        stepTitle: "CUSTOM_STEP",
      })

      expect(
        screen.getByText(`CUSTOM_STEP 2/${steps.length}`, {
          trim: false,
          collapseWhitespace: false,
        }),
      ).toBeInTheDocument()
    })

    test("SomStepper does not render the step title when disabled", () => {
      renderStepper({ activeStep: 1, showStepTitle: false })

      expect(screen.queryByText("STEP_TITLE")).not.toBeInTheDocument()
      expect(screen.getByText(`2/${steps.length}`)).toBeInTheDocument()
    })

    test("SomStepper renders with progressbar", () => {
      const activeStep = 1
      renderStepper({ activeStep })

      // Calculate the progress
      // activeStep starts at 0
      const internalActiveStep = activeStep + 1
      const numSteps = steps.length
      // Component calculate percent with Math.ceil
      const expectedValue = Math.ceil((internalActiveStep / numSteps) * 100)

      // Rendered progress value
      const progressValue = Number(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      )
      expect(expectedValue).toBe(progressValue)
    })

    test("SomStepper renders the active step content by default", () => {
      renderStepper({ activeStep: 1 })

      expect(screen.getByText("DARLING")).toBeInTheDocument()
      expect(screen.queryByText("HELLO")).not.toBeInTheDocument()
    })

    test("SomStepper gives priority to children over the step content", () => {
      renderStepper({ activeStep: 1, children: <div>OVERRIDE CONTENT</div> })

      expect(screen.getByText("OVERRIDE CONTENT")).toBeInTheDocument()
      expect(screen.queryByText("DARLING")).not.toBeInTheDocument()
    })

    test("SomStepper advances to the next step when clicking next", () => {
      render(<StepperWrapper initialStep={0} />)

      fireEvent.click(screen.getByRole("button", { name: "NEXT" }))

      expect(screen.getByText("DARLING")).toBeInTheDocument()
    })

    test("SomStepper goes back to the previous step when clicking prev", () => {
      render(<StepperWrapper initialStep={1} />)

      fireEvent.click(screen.getByRole("button", { name: "PREV" }))

      expect(screen.getByText("HELLO")).toBeInTheDocument()
    })

    test("SomStepper shows only the next button on the first step", () => {
      renderStepper({ activeStep: 0, disableNext: false })

      expect(
        screen.queryByRole("button", { name: "PREV" }),
      ).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "NEXT" })).toBeInTheDocument()
    })

    test("SomStepper shows prev and next buttons on intermediate steps", () => {
      renderStepper({ activeStep: 1, disableNext: false })

      expect(screen.getByRole("button", { name: "PREV" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "NEXT" })).toBeInTheDocument()
    })

    test("SomStepper hides prev and keeps next on the last step", () => {
      renderStepper({ activeStep: steps.length - 1, disableNext: false })

      expect(
        screen.queryByRole("button", { name: "PREV" }),
      ).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "NEXT" })).toBeInTheDocument()
    })

    test("SomStepper hides the next button after the last step", () => {
      renderStepper({ activeStep: steps.length })

      expect(
        screen.queryByRole("button", { name: "NEXT" }),
      ).not.toBeInTheDocument()
    })

    test("SomStepper disables the default next button when requested", () => {
      renderStepper({ disableNext: true })

      expect(screen.getByRole("button", { name: "NEXT" })).toBeDisabled()
    })

    test("SomStepper renders a custom next button instead of the default one", () => {
      renderStepper({
        nextButton: <button type="button">CUSTOM NEXT</button>,
      })

      expect(
        screen.getByRole("button", { name: "CUSTOM NEXT" }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "NEXT" }),
      ).not.toBeInTheDocument()
    })

    test("SomStepper hides the progress header when disabled", () => {
      renderStepper({ showStepProgress: false, showStepTitle: true })

      expect(screen.queryByText(/STEP_TITLE/)).not.toBeInTheDocument()
      expect(screen.queryByText(`1/${steps.length}`)).not.toBeInTheDocument()
    })
  })

  describe("SomStepper without steps", () => {
    test("SomStepper renders", () => {
      render(<NewSomStepper />)
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })

    test("SomStepper without the steps progressbar header", () => {
      render(<NewSomStepper showStepProgress={false}>Content</NewSomStepper>)

      expect(screen.queryByText("STEP_TITLE")).not.toBeInTheDocument()
    })

    test("SomStepper renders children without steps", () => {
      render(<NewSomStepper>Content</NewSomStepper>)

      expect(screen.getByText("Content")).toBeInTheDocument()
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      expect(screen.queryByText(/0\//)).not.toBeInTheDocument()
    })
  })
})
