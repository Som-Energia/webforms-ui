const base = {
    entryValues: {
        "holder": {
            "vat": '',
            "vatvalid": false,
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif_phisical": true,
            "state": { id: '' },
            "city": { id: '' },
            "proxynif": '',
            "proxyname": '',
            "name": '',
            "address": '',
            "number": '',
            "floor": '',
            "door": '',
            "postal_code": '',
            "surname1": '',
            "surname2": '',
            "email": '',
            "email2": '',
            "phone1": '',
            "phone2": '',
            "language": "es_ES"
        },
        "supply_point": {
            "cups": '',
            "status": false,
            "address": '',
            "verified": false,
            "supply_point_accepted": false,
            "tariff_type": ''
        },
        "member": {
            "become_member": undefined,
            "invite_token": false,
            "checked": false
        },
        "payment": {
            "iban": '',
            "sepa_accepted": false,
            "voluntary_cent": ''
        },
        "especial_cases": {
            "reason_default": true,
            "reason_death": false,
            "reason_merge": false,
            "reason_electrodep": false,
            "attachments": {}
        },
        "privacy_policy_accepted": false,
        "terms_accepted": false,
        "legal_person_accepted": false
    },
    normalizedData: {
        "holder": {
            "vat": '',
            "state": NaN,
            "city": NaN,
            "name": '',
            "address": ',',
            "postal_code": '',
            "surname1": '',
            "surname2": '',
            "email": '',
            "email2": '',
            "phone1": '',
            "language": 'es_ES'
        },
        "supply_point": { cups: '', address: '', tariff_type: '' },
        "member": { invite_token: false },
        "payment": { iban: '', sepa_accepted: false, voluntary_cent: '' },
        "especial_cases": {
            "reason_death": false,
            "reason_merge": false,
            "reason_electrodep": false
        },
        "privacy_policy_accepted": false,
        "terms_accepted": false
    }
}
const changeHolder = {
    entryValues: {
        "holder": {
            "vat": "58291270R",
            "vatvalid": true,
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif_phisical": true,
            "state": {
                "id": 20,
                "name": "Girona"
            },
            "city": {
                "id": 5386,
                "name": "Girona"
            },
            "proxynif": "",
            "proxyname": "",
            "name": "David",
            "address": "Percebe",
            "number": "13",
            "floor": "",
            "door": "",
            "postal_code": "17003",
            "surname1": "Palomo",
            "surname2": "Romero",
            "email": "david.palomo@somenergia.coop",
            "email2": "david.palomo@somenergia.coop",
            "phone1": "636696969",
            "phone2": "",
            "language": "ca_ES",
            "ismember": true
        },
        "supply_point": {
            "cups": "ES0031405994023009AD0F",
            "status": "active",
            "address": "SANT ANTONI MARIA CLARET",
            "verified": true,
            "supply_point_accepted": true,
            "tariff_type": "atr"
        },
        "member": {
            "invite_token": false,
            "checked": false
        },
        "payment": {
            "iban": "ES77 1234 1234 1612 3456 7890",
            "sepa_accepted": true,
            "voluntary_cent": true,
            "iban_valid": true
        },
        "especial_cases": {
            "reason_default": true,
            "reason_death": false,
            "reason_merge": false,
            "reason_electrodep": false,
            "attachments": {}
        },
        "privacy_policy_accepted": true,
        "terms_accepted": true,
        "legal_person_accepted": false
    },
    normalizedData: {
        "holder": {
            "vat": "58291270R",
            "state": 20,
            "city": 5386,
            "name": "David",
            "address": "Percebe, 13",
            "postal_code": "17003",
            "surname1": "Palomo",
            "surname2": "Romero",
            "email": "david.palomo@somenergia.coop",
            "email2": "david.palomo@somenergia.coop",
            "phone1": "636696969",
            "language": "ca_ES"
        },
        "supply_point": {
            "cups": "ES0031405994023009AD0F",
            "address": "SANT ANTONI MARIA CLARET",
            "tariff_type": "atr"
        },
        "member": {
            "invite_token": false,
            "become_member": false,
            "link_member": false
        },
        "payment": {
            "iban": "ES7712341234161234567890",
            "sepa_accepted": true,
            "voluntary_cent": true
        },
        "especial_cases": {
            "reason_death": false,
            "reason_merge": false,
            "reason_electrodep": false
        },
        "privacy_policy_accepted": true,
        "terms_accepted": true
    }
}


const holderChangeCases = {
    base: base,
    changeHolder: changeHolder
}

export default holderChangeCases