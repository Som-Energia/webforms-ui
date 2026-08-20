import React from "react"

import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react"
import { vi } from "vitest"

import { PopUpContextProvider } from "../../../context/PopUpContext"
import GenerationContext from "../context/GenerationContext"
import AssignmentsTable from "./AssignmentsTable"

const dndState = vi.hoisted(() => ({
  onDragEnd: undefined,
}))

vi.mock("react-i18next", async () => import("../../../tests/__mocks__/i18n.js"))

vi.mock("@dnd-kit/core", () => ({
  closestCenter: vi.fn(),
  DndContext: ({ children, onDragEnd }) => {
    dndState.onDragEnd = onDragEnd
    return <div data-testid="dnd-context">{children}</div>
  },
  PointerSensor: vi.fn(),
  useSensor: vi.fn(() => ({ sensor: "pointer" })),
  useSensors: vi.fn((...sensors) => sensors),
}))

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }) => <>{children}</>,
  useSortable: ({ id }) => ({
    attributes: { "data-sortable-id": id },
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
  }),
  verticalListSortingStrategy: vi.fn(),
}))

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: vi.fn(() => undefined),
    },
  },
}))

describe("AssignmentsTable", () => {
  const columns = [
    "PRIORITY",
    "N_CONTRACT",
    "ADDRESS",
    "LAST_INVOICED",
    "ANNUAL_USE_KWH",
    "ACTIONS",
  ]

  const rows = [
    {
      id: "00001",
      contract: "ES0031405524755001RN0F - 0010777",
      contractAddress: "Major, 22, 3o 08970 (Sant Joan Despi)",
      priority: 0,
      contractLastInvoiced: "2023-01-08",
      annualUseKwh: "7105.0",
    },
    {
      id: "00002",
      contract: "ES0031405524910014WM0F - 0013117",
      contractAddress: "Jacint Verdaguer, 42, 3er 1a 08970 (Sant Joan Despi)",
      priority: 1,
      contractLastInvoiced: "2023-01-04",
      annualUseKwh: "115.0",
    },
  ]

  const getPriority = (priority) => ({ value: `Priority ${priority + 1}` })

  const renderComponent = (props = {}) => {
    const defaultProps = {
      rows,
      columns,
      loading: false,
      handleDelete: vi.fn(),
      handleChangeSort: vi.fn(),
    }

    const view = render(
      <PopUpContextProvider>
        <GenerationContext.Provider value={{ getPriority }}>
          <AssignmentsTable {...defaultProps} {...props} />
        </GenerationContext.Provider>
      </PopUpContextProvider>,
    )

    return {
      ...view,
      props: { ...defaultProps, ...props },
    }
  }

  const getDeleteButton = (container, id) =>
    container.querySelector(`#delete-button-${id}`)

  test("renders the assignment row values with formatted fields", () => {
    renderComponent()

    expect(screen.getByText("Priority 1")).toBeInTheDocument()
    expect(screen.getByText(rows[0].contract)).toBeInTheDocument()
    expect(screen.getByText(rows[0].contractAddress)).toBeInTheDocument()
    expect(screen.getByText("08/01/2023")).toBeInTheDocument()
    expect(
      screen.getByText(
        Number(rows[0].annualUseKwh).toLocaleString("es-ES", {
          minimumFractionDigits: 2,
        }),
      ),
    ).toBeInTheDocument()
  })

  test("opens the confirmation dialog and accepts with the row id", async () => {
    const handleDelete = vi.fn()

    const { container } = renderComponent({ handleDelete })

    fireEvent.click(getDeleteButton(container, rows[0].id))

    expect(
      await screen.findByText("GENERATION_ASSIGNMENTS_CONFIRM_TITLE"),
    ).toBeInTheDocument()

    fireEvent.click(await screen.findByTestId("simple-dialog-button-accept"))

    expect(handleDelete).toHaveBeenCalledWith(rows[0].id)
  })

  test("disables delete actions while loading", () => {
    const { container } = renderComponent({ loading: true })

    expect(getDeleteButton(container, rows[0].id)).toBeDisabled()
  })

  test("does not sort when the dragged item stays on the same row", () => {
    const handleChangeSort = vi.fn()

    renderComponent({ handleChangeSort })

    act(() => {
      dndState.onDragEnd({
        active: { id: rows[0].contract },
        over: { id: rows[0].contract },
      })
    })

    expect(handleChangeSort).not.toHaveBeenCalled()
  })

  test("sorts with the source and target indices when the dragged row changes", () => {
    const handleChangeSort = vi.fn()

    renderComponent({ handleChangeSort })

    act(() => {
      dndState.onDragEnd({
        active: { id: rows[1].contract },
        over: { id: rows[0].contract },
      })
    })

    expect(handleChangeSort).toHaveBeenCalledWith(1, 0)
  })
})
