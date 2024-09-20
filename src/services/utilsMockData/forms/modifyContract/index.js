const power20 = {
    entryValues: {
        "token": "ae74f2147ad1ec0d524fd387b055a75e38b5ebe5ee4e801eea847a9f46d2cd905dd545fd846ed0ee29d9b0ac153480da2f526f9dda041cab91fe5d5bcfae29a0",
        "modify": {
            "changePhases": false,
            "phases": "",
            "attachments": [],
            "changePower": true,
            "power": "5.5",
            "power2": "5.7",
            "power3": "",
            "power4": "",
            "power5": "",
            "power6": "",
            "power_attachments": [],
            "moreThan15Kw": false,
            "tariff": "2.0TD"
        },
        "contact": {
            "contactName": "Aitor",
            "contactSurname": "Menta",
            "phone": "606605445"
        }
    },
    normalizedData: {
        "power_p1": 5500,
        "power_p2": 5700,
        "tariff": "2.0TD",
        "contact_name": "Aitor",
        "contact_surname": "Menta",
        "contact_phone": "606605445"
    }
}

const power30 = {
    entryValues: {
        "token": "ae74f2147ad1ec0d524fd387b055a75e38b5ebe5ee4e801eea847a9f46d2cd905dd545fd846ed0ee29d9b0ac153480da2f526f9dda041cab91fe5d5bcfae29a0",
        "modify": {
            "changePhases": false,
            "phases": "",
            "attachments": [],
            "changePower": true,
            "power": "5.5",
            "power2": "5.7",
            "power3": "10",
            "power4": "10",
            "power5": "15",
            "power6": "16",
            "power_attachments": [],
            "moreThan15Kw": true,
            "tariff": "3.0TD"
        },
        "contact": {
            "contactName": "Aitor",
            "contactSurname": "Menta",
            "phone": "606605445"
        }
    },
    normalizedData: {
        "power_p1": 5500,
        "power_p2": 5700,
        "power_p3": 10000,
        "power_p4": 10000,
        "power_p5": 15000,
        "power_p6": 16000,
        "tariff": "3.0TD",
        "contact_name": "Aitor",
        "contact_surname": "Menta",
        "contact_phone": "606605445"
    }
}

const modifyContractCases = {
    power20: power20,
    power30: power30
}

export default modifyContractCases