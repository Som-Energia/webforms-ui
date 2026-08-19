import { useState } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import NewSomStepper from "./NewSomStepper"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

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

describe("NewSomStepper", () => {
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

  describe("with steps", () => {
    test("renders the progress bar", () => {
      renderStepper()

      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })

    test("renders the current step count", () => {
      renderStepper({ activeStep: 1 })

      const expectedText = `2/${steps.length}`
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })

    test("caps the visible step count when activeStep overflows", () => {
      renderStepper({ activeStep: 99 })

      const expectedText = `${steps.length}/${steps.length}`
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })

    test("renders the step title when enabled", () => {
      renderStepper({ activeStep: 1, showStepTitle: true })

      const expectedStepTitle = `STEP_TITLE 2/${steps.length}`
      expect(
        screen.getByText(expectedStepTitle, {
          trim: false,
          collapseWhitespace: false,
        }),
      ).toBeInTheDocument()
    })

    test("renders a custom step title key when provided", () => {
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

    test("does not render the step title when disabled", () => {
      renderStepper({ activeStep: 1, showStepTitle: false })

      expect(screen.queryByText("STEP_TITLE")).not.toBeInTheDocument()
      expect(screen.getByText(`2/${steps.length}`)).toBeInTheDocument()
    })

    test("renders the expected progress value", () => {
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

    test("renders the active step content by default", () => {
      renderStepper({ activeStep: 1 })

      expect(screen.getByText("DARLING")).toBeInTheDocument()
      expect(screen.queryByText("HELLO")).not.toBeInTheDocument()
    })

    test("gives priority to children over the step content", () => {
      renderStepper({ activeStep: 1, children: <div>OVERRIDE CONTENT</div> })

      expect(screen.getByText("OVERRIDE CONTENT")).toBeInTheDocument()
      expect(screen.queryByText("DARLING")).not.toBeInTheDocument()
    })

    test("advances to the next step when clicking next", async () => {
      const user = userEvent.setup()

      render(<StepperWrapper initialStep={0} />)

      await user.click(screen.getByRole("button", { name: "NEXT" }))

      expect(screen.getByText("DARLING")).toBeInTheDocument()
    })

    test("goes back to the previous step when clicking prev", async () => {
      const user = userEvent.setup()

      render(<StepperWrapper initialStep={1} />)

      await user.click(screen.getByRole("button", { name: "PREV" }))

      expect(screen.getByText("HELLO")).toBeInTheDocument()
    })

    test("shows only the next button on the first step", () => {
      renderStepper({ activeStep: 0, disableNext: false })

      expect(
        screen.queryByRole("button", { name: "PREV" }),
      ).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "NEXT" })).toBeInTheDocument()
    })

    test("shows prev and next buttons on intermediate steps", () => {
      renderStepper({ activeStep: 1, disableNext: false })

      expect(screen.getByRole("button", { name: "PREV" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "NEXT" })).toBeInTheDocument()
    })

    test("hides prev and keeps next on the last step", () => {
      renderStepper({ activeStep: steps.length - 1, disableNext: false })

      expect(
        screen.queryByRole("button", { name: "PREV" }),
      ).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "NEXT" })).toBeInTheDocument()
    })

    test("hides the next button after the last step", () => {
      renderStepper({ activeStep: steps.length })

      expect(
        screen.queryByRole("button", { name: "NEXT" }),
      ).not.toBeInTheDocument()
    })

    test("disables the default next button when requested", () => {
      renderStepper({ disableNext: true })

      expect(screen.getByRole("button", { name: "NEXT" })).toBeDisabled()
    })

    test("renders a custom next button instead of the default one", () => {
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

    test("hides the progress header when disabled", () => {
      renderStepper({ showStepProgress: false, showStepTitle: true })

      expect(screen.queryByText(/STEP_TITLE/)).not.toBeInTheDocument()
      expect(screen.queryByText(`1/${steps.length}`)).not.toBeInTheDocument()
    })
  })

  describe("without steps", () => {
    test("does not render the progress bar", () => {
      render(<NewSomStepper />)
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })

    test("does not render the progress header when disabled", () => {
      render(<NewSomStepper showStepProgress={false}>Content</NewSomStepper>)

      expect(screen.queryByText("STEP_TITLE")).not.toBeInTheDocument()
    })

    test("renders children without steps", () => {
      render(<NewSomStepper>Content</NewSomStepper>)

      expect(screen.getByText("Content")).toBeInTheDocument()
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      expect(screen.queryByText(/0\//)).not.toBeInTheDocument()
    })
  })
})
