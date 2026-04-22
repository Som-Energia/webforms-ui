import React from 'react'

import NewContractMemberForm from './NewContractMember/NewContractMember';

const UnifiedContractForm = (props) => {

    const root = document.getElementById("root")
    const tariff = root.getAttribute("data-contract-tariff") || 'indexed';


    return (
        <NewContractMemberForm
            {...props}
            tariff={tariff}
        />
    )
}

export default UnifiedContractForm
