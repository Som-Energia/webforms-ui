class Stack {
    constructor() { 
        this.items = []; 
        if (typeof Stack.instance === "object"){
            return Stack.instance
        }
        Stack.instance = this
        return this
    }

    // Push operation
    push(element) { this.items.push(element); }

    // Pop operation
    pop()
    {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items.pop();
    }

    // Peek operation
    peek()
    {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items[this.items.length - 1];
    }

    // isEmpty operation
    isEmpty() { return this.items.length === 0; }

    // Size operation
    size() { return this.items.length; }

    // Print the stack
    print() { console.log(this.items); }
}

export default Stack