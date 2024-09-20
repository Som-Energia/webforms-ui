const base = {
    entryValues: {
        "member": {
            "vat": '',
            "vatvalid": false,
            "isphisical": true,
            "proxynif_valid": false,
            "proxynif": '',
            "proxyname": '',
            "name": '',
            "address": '',
            "number": '',
            "floor": '',
            "door": '',
            "postal_code": '',
            "state": { id: '' },
            "city": { id: '' },
            "surname1": '',
            "surname2": '',
            "email": '',
            "email2": '',
            "phone1": '',
            "phone2": '',
            "language": "es_ES"
        },
        "payment": {
            "iban": '',
            "sepa_accepted": false,
            "payment_method": ''
        },
        "privacy_policy_accepted": false,
        "terms_accepted": false,
        "legal_person_accepted": false,
        "urlok": "NEWMEMBER_OK_REDIRECT_URL",
        "urlko": "NEWMEMBER_KO_REDIRECT_URL"
    },
    normalizedData: {
        "tipuspersona": 'fisica',
        "nom": '',
        "dni": '',
        "tel": '',
        "tel2": '',
        "email": '',
        "cp": '',
        "provincia": '',
        "adreca": ',',
        "municipi": '',
        "idioma": 'es_ES',
        "payment_method": 'remesa',
        "payment_iban": '',
        "urlok": 'NEWMEMBER_OK_REDIRECT_URL',
        "urlko": 'NEWMEMBER_KO_REDIRECT_URL',
        "cognom": ''
    }
}
const newMember = {
    entryValues: {
        "member": {
            "vat": "D23852064",
            "vatvalid": true,
            "isphisical": false,
            "proxynif_valid": true,
            "proxynif": "31959788T",
            "proxyname": "David Palomo",
            "name": "Los Pollos Hermanos",
            "address": "Percebe, nº 13",
            "number": "",
            "floor": "",
            "door": "",
            "postal_code": "17003",
            "state": {
                "id": "20",
                "name": "Girona"
            },
            "city": {
                "id": 5386,
                "name": "Girona"
            },
            "surname1": "",
            "surname2": "",
            "email": "david.palomo@somenergia.coop",
            "email2": "david.palomo@somenergia.coop",
            "phone1": "636696969",
            "phone2": "",
            "language": "ca_ES",
            "proxynif_phisical": true
        },
        "payment": {
            "sepa_accepted": true,
            "payment_method": "iban",
            "iban_valid": true,
            "iban": "ES77 1234 1234 1612 3456 7890"
        },
        "privacy_policy_accepted": true,
        "terms_accepted": true,
        "legal_person_accepted": true,
        "urlok": "https://www.somenergia.coop/es/pago-realizado/",
        "urlko": "https://www.somenergia.coop/es/pago-cancelado/"
    },
    normalizedData: {
        "tipuspersona": "juridica",
        "nom": "Los Pollos Hermanos",
        "dni": "D23852064",
        "tel": "636696969",
        "tel2": "",
        "email": "david.palomo@somenergia.coop",
        "cp": "17003",
        "provincia": "20",
        "adreca": "Percebe, nº 13,",
        "municipi": 5386,
        "idioma": "ca_ES",
        "payment_method": "remesa",
        "payment_iban": "ES77 1234 1234 1612 3456 7890",
        "urlok": "https://www.somenergia.coop/es/pago-realizado/",
        "urlko": "https://www.somenergia.coop/es/pago-cancelado/",
        "representant_nom": "David Palomo",
        "representant_dni": "31959788T"
    }
}


const memberCases = {
    base: base,
    newMember: newMember
}

export default memberCases