
const base = {
    normalizedData: {
        "cups_address": ",",
        "cups_city_id": 0,
        "cups_state_id": 0,
        "supply_point_accepted": false,
        "owner_is_member": true,
        "owner_is_payer": true,
        "sepa_conditions": false,
        "process": "A3",
        "general_contract_terms_accepted": false,
        "particular_contract_terms_accepted": false
    },
    entryValues: {
        "holder": {
            "vat": "",
            "vatvalid": false,
            "previous_holder": "",
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "number": "",
            "floor": "",
            "door": "",
            "postal_code": "",
            "state": { "id": "" },
            "city": { "id": "" },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "supply_point": {
            "cups": "",
            "status": false,
            "address": "",
            "number": "",
            "floor": "",
            "door": "",
            "postal_code": "",
            "state": { "id": "" },
            "city": { "id": "" },
            "is_housing": "",
            "cnae": "",
            "cnae_valid": false,
            "cadastral_reference": "",
            "cadastral_reference_error": null,
            "attachments": [],
            "supply_point_accepted": false,
            "lat": false,
            "long": false,
            "coordinates_accuracy": ""
        },
        "self_consumption": {
            "have_installation": ""
        },
        "contract": {
            "has_service": "",
            "rate": "",
            "power": "",
            "power2": "",
            "power3": "",
            "phases": "",
            "fare": "",
            "moreThan15Kw": false,
            "isIndexed": ""
        },
        "member": {
            "number": "",
            "vat": "",
            "full_name": "",
            "checked": false,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "postal_code": "",
            "state": { "id": "" },
            "city": { "id": "" },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "payment": {
            "iban": "",
            "sepa_accepted": false,
            "voluntary_cent": ""
        },
        "privacy_policy_accepted": false,
        "terms_accepted": false,
        "particular_contract_terms_accepted": false,
        "legal_person_accepted": false
    }
}

const withSelfConsumption = {
    entryValues: {
        "holder": {
            "vat": "40323835M",
            "vatvalid": true,
            "previous_holder": true,
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "number": "",
            "floor": "",
            "door": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "supply_point": {
            "cups": "ES0396498453925524CM",
            "status": "new",
            "address": "Pedro López",
            "number": "13",
            "floor": "",
            "door": "",
            "postal_code": "17003",
            "state": {
                "id": 20,
                "name": "Girona"
            },
            "city": {
                "id": 5386,
                "name": "Girona"
            },
            "is_housing": true,
            "cnae": "9820",
            "cnae_valid": true,
            "attachments": [],
            "supply_point_accepted": true,
            "lat": false,
            "long": false,
            "coordinates_accuracy": ""
        },
        "self_consumption": {
            "have_installation": true,
            "attachments": [],
            "cau": "ES 0353 5010 2861 5353 EE 0F A000",
            "collective_installation": true,
            "installation_power": "3.5",
            "installation_type": "01",
            "technology": "b11",
            "aux_services": false
        },
        "contract": {
            "rate": "2.0TD",
            "power": "4.4",
            "power2": "8",
            "power3": "",
            "fare": "",
            "phases": "",
            "moreThan15Kw": false,
            "has_service": true,
            "isIndexed": false
        },
        "member": {
            "number": "38434",
            "vat": "40323835M",
            "full_name": "",
            "checked": true,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "payment": {
            "iban": "ES77 1234 1234 1612 3456 7890",
            "sepa_accepted": true,
            "voluntary_cent": true,
            "iban_valid": true
        },
        "privacy_policy_accepted": true,
        "terms_accepted": true,
        "particular_contract_terms_accepted": true,
        "legal_person_accepted": false
    },
    normalizedData: {
        "member_number": "38434",
        "member_vat": "40323835M",
        "cups": "ES0396498453925524CM",
        "is_indexed": false,
        "tariff": "2.0TD",
        "power_p1": "4400",
        "power_p2": "8000",
        "cups_address": "Pedro López, 13",
        "cups_postal_code": "17003",
        "cups_city_id": 5386,
        "cups_state_id": 20,
        "cnae": "9820",
        "supply_point_accepted": true,
        "owner_is_member": true,
        "owner_is_payer": true,
        "payment_iban": "ES77 1234 1234 1612 3456 7890",
        "sepa_conditions": true,
        "donation": true,
        "process": "C1",
        "general_contract_terms_accepted": true,
        "particular_contract_terms_accepted": true,
        "self_consumption": {
            "cau": "ES0353501028615353EE0FA000",
            "collective_installation": true,
            "installation_power": "3500",
            "installation_type": "01",
            "technology": "b11",
            "aux_services": false
        }
    }
}

const withCUPSNoService = {
    entryValues: {
        "holder": {
            "vat": "40323835M",
            "vatvalid": true,
            "previous_holder": false,
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "number": "",
            "floor": "",
            "door": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "supply_point": {
            "cups": "ES0396498453925524CM",
            "status": "new",
            "address": "Pedro López",
            "number": "13",
            "floor": "",
            "door": "",
            "postal_code": "17003",
            "state": {
                "id": 20,
                "name": "Girona"
            },
            "city": {
                "id": 5386,
                "name": "Girona"
            },
            "is_housing": true,
            "cnae": "9820",
            "cnae_valid": true,
            "attachments": [],
            "supply_point_accepted": true,
            "lat": false,
            "long": false,
            "coordinates_accuracy": ""
        },
        "self_consumption": {
            "have_installation": ""
        },
        "contract": {
            "rate": "2.0TD",
            "power": "4.4",
            "power2": "8",
            "power3": "",
            "fare": "",
            "phases": "mono",
            "moreThan15Kw": false,
            "has_service": false,
            "isIndexed": false
        },
        "member": {
            "number": "38434",
            "vat": "40323835M",
            "full_name": "",
            "checked": true,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "payment": {
            "iban": "ES77 1234 1234 1612 3456 7890",
            "sepa_accepted": true,
            "voluntary_cent": true,
            "iban_valid": true
        },
        "privacy_policy_accepted": true,
        "terms_accepted": true,
        "particular_contract_terms_accepted": true,
        "legal_person_accepted": false
    },
    normalizedData: {
        "member_number": "38434",
        "member_vat": "40323835M",
        "cups": "ES0396498453925524CM",
        "is_indexed": false,
        "tariff": "2.0TD",
        "power_p1": "4400",
        "power_p2": "8000",
        "cups_address": "Pedro López, 13",
        "cups_postal_code": "17003",
        "cups_city_id": 5386,
        "cups_state_id": 20,
        "cnae": "9820",
        "supply_point_accepted": true,
        "owner_is_member": true,
        "owner_is_payer": true,
        "payment_iban": "ES77 1234 1234 1612 3456 7890",
        "sepa_conditions": true,
        "donation": true,
        "process": "A3",
        "general_contract_terms_accepted": true,
        "particular_contract_terms_accepted": true
    }
}

const with30TD = {
    entryValues: {
        "holder": {
            "vat": "40323835M",
            "vatvalid": true,
            "previous_holder": false,
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "number": "",
            "floor": "",
            "door": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "supply_point": {
            "cups": "ES0396498453925524CM",
            "status": "new",
            "address": "Pedro López",
            "number": "13",
            "floor": "",
            "door": "",
            "postal_code": "17003",
            "state": {
                "id": 20,
                "name": "Girona"
            },
            "city": {
                "id": 5386,
                "name": "Girona"
            },
            "is_housing": true,
            "cnae": "9820",
            "cnae_valid": true,
            "attachments": [],
            "supply_point_accepted": true,
            "lat": false,
            "long": false,
            "coordinates_accuracy": ""
        },
        "self_consumption": {
            "have_installation": ""
        },
        "contract": {
            "rate": "3.0TD",
            "power": "4.4",
            "power2": "8",
            "power3": "10",
            "fare": "",
            "phases": "mono",
            "moreThan15Kw": true,
            "has_service": false,
            "power4": "12",
            "power5": "14",
            "power6": "16",
            "isIndexed": false
        },
        "member": {
            "number": "38434",
            "vat": "40323835M",
            "full_name": "",
            "checked": true,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "payment": {
            "iban": "ES77 1234 1234 1612 3456 7890",
            "sepa_accepted": true,
            "voluntary_cent": true,
            "iban_valid": true
        },
        "privacy_policy_accepted": true,
        "terms_accepted": true,
        "particular_contract_terms_accepted": true,
        "legal_person_accepted": false
    },
    normalizedData: {
        "member_number": "38434",
        "member_vat": "40323835M",
        "cups": "ES0396498453925524CM",
        "is_indexed": false,
        "tariff": "3.0TD",
        "power_p1": "4400",
        "power_p2": "8000",
        "power_p3": "10000",
        "power_p4": "12000",
        "power_p5": "14000",
        "power_p6": "16000",
        "cups_address": "Pedro López, 13",
        "cups_postal_code": "17003",
        "cups_city_id": 5386,
        "cups_state_id": 20,
        "cnae": "9820",
        "supply_point_accepted": true,
        "owner_is_member": true,
        "owner_is_payer": true,
        "payment_iban": "ES77 1234 1234 1612 3456 7890",
        "sepa_conditions": true,
        "donation": true,
        "process": "A3",
        "general_contract_terms_accepted": true,
        "particular_contract_terms_accepted": true
    }
}

const with20 = {
    entryValues: {
        "holder": {
            "vat": "40323835M",
            "vatvalid": true,
            "previous_holder": true,
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "number": "",
            "floor": "",
            "door": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "supply_point": {
            "cups": "ES0396498453925524CM",
            "status": "new",
            "address": "Pedro López",
            "number": "13",
            "floor": "",
            "door": "",
            "postal_code": "17003",
            "state": {
                "id": 20,
                "name": "Girona"
            },
            "city": {
                "id": 5386,
                "name": "Girona"
            },
            "is_housing": true,
            "cnae": "9820",
            "cnae_valid": true,
            "attachments": [],
            "supply_point_accepted": true,
            "lat": false,
            "long": false,
            "coordinates_accuracy": ""
        },
        "self_consumption": {
            "have_installation": false
        },
        "contract": {
            "rate": "2.0TD",
            "power": "4.4",
            "power2": "8",
            "power3": "",
            "fare": "",
            "phases": "",
            "moreThan15Kw": false,
            "has_service": true,
            "isIndexed": false
        },
        "member": {
            "number": "38434",
            "vat": "40323835M",
            "full_name": "",
            "checked": true,
            "proxynif": "",
            "proxyname": "",
            "name": "",
            "address": "",
            "postal_code": "",
            "state": {
                "id": ""
            },
            "city": {
                "id": ""
            },
            "surname1": "",
            "surname2": "",
            "email": "",
            "email2": "",
            "phone1": "",
            "phone2": "",
            "language": "es_ES"
        },
        "payment": {
            "iban": "ES77 1234 1234 1612 3456 7890",
            "sepa_accepted": true,
            "voluntary_cent": true,
            "iban_valid": true
        },
        "privacy_policy_accepted": true,
        "terms_accepted": true,
        "particular_contract_terms_accepted": true,
        "legal_person_accepted": false
    },
    normalizedData: {
        "member_number": "38434",
        "member_vat": "40323835M",
        "cups": "ES0396498453925524CM",
        "is_indexed": false,
        "tariff": "2.0TD",
        "power_p1": "4400",
        "power_p2": "8000",
        "cups_address": "Pedro López, 13",
        "cups_postal_code": "17003",
        "cups_city_id": 5386,
        "cups_state_id": 20,
        "cnae": "9820",
        "supply_point_accepted": true,
        "owner_is_member": true,
        "owner_is_payer": true,
        "payment_iban": "ES77 1234 1234 1612 3456 7890",
        "sepa_conditions": true,
        "donation": true,
        "process": "C1",
        "general_contract_terms_accepted": true,
        "particular_contract_terms_accepted": true
    }
}
const contractCases = {
    base: base,
    with20: with20,
    withSelfConsumption: withSelfConsumption,
    withCUPSNoService: withCUPSNoService,
    with30TD: with30TD
}

export default contractCases