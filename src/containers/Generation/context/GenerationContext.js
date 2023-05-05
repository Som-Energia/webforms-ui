import {useState, createContext, useCallback, useMemo} from 'react'

const GenerationContext = createContext({
    contracts: [],
    modifyContract: () => {}
  })


const mockContracts = [
    {contract:"ES0031409034584001YH0T - 0004438",address:"MARCELÍ PISOS, Nº9 08944 (Sant Celoni)",priority:0,lastDate:"9 de Enero de 2023",use:9539.00},
    {contract:"ES0031417072261001EE0Q - 0004438",address:"MARCELÍ PISOS, Nº3 09770 (Sant Celoni)",priority:1,lastDate:"19 de Febrero de 2023",use:4588.00},
    {contract:"ES0031456093395001RR0P - 0004438",address:"MARCELÍ PISOS, Nº5 02950 (Sant Celoni)",priority:2,lastDate:"3 de Abril de 2023",use:2537.00},
    {contract:"ES0031321085566001WQ0F - 0004438",address:"MARCELÍ PISOS, Nº6 03974 (Sant Celoni)",priority:3,lastDate:"6 de Mayo de 2023",use:3833.00}
]



export const GenerationContextProvider = ({children}) => {
  const [contracts, setContracts] = useState(mockContracts);

  const modifyPriorityContract = useCallback((id, priority) => {
    let newContracts = JSON.parse(JSON.stringify(contracts))
    newContracts.forEach(contract => {
        if(contract.contract === id){
            contract.priority = priority
        }
    })
    setContracts(newContracts)
  }, [contracts]);

  const contextValue = useMemo(() => ({
    contracts,
    modifyPriorityContract
  }), [contracts, modifyPriorityContract]);

  return (
    <GenerationContext.Provider 
    value={contextValue}>
      {children}
    </GenerationContext.Provider>
  );
}

export default GenerationContext