import IndexedReviewField from "./IndexedReviewField";
import { render, screen } from "@testing-library/react";


describe("Test that it correctly renders", () => {
    const mockLabel = "MOCK LABEL";
    const mockValue = "MOCK VALUE";
    

    test("The component render properly all texts",() =>{
        render(<IndexedReviewField label={mockLabel} value={mockValue}/>)
        const labelElement = screen.getByText(mockLabel);
        const valueElement = screen.getByText(mockValue);
        expect(labelElement).toBeInTheDocument();
        expect(valueElement).toBeInTheDocument();
    })

    test("The component render properly without label",() =>{
        render(<IndexedReviewField value={mockValue} />)
        const labelElement = screen.queryByText(mockLabel);
        const valueElement = screen.getByText(mockValue);
        expect(labelElement).toBeNull();
        expect(valueElement).toBeInTheDocument();
    })

    test("The component render properly without value",() =>{
        render(<IndexedReviewField label={mockLabel} />)
        const labelElement = screen.getByText(mockLabel);
        const valueElement = screen.queryByText(mockValue);
        expect(labelElement).toBeInTheDocument();
        expect(valueElement).toBeNull();
    })
})