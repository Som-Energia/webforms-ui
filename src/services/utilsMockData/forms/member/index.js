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
const newNewMemberPhisical = {
    entryValues: {
        address: {
            bloc: "C",
            city: { id: 5386, name: "Girona" },
            door: "1",
            floor: "1",
            has_different_address: null,
            number: "24",
            postal_code: "17005",
            stairs: "B",
            state: { id: 20, name: "Girona" },
            street: "Avinguda de Sant Narcís"
        },
        generic_especific_conditons_accepted: false,
        is_client: null,
        new_member: {
            become_member: false,
            birthdate: new Date("1994-09-01T00:00:00+02:00"),
            comercial_info_accepted: false,
            email: "random@domain.coop",
            email2: "random@domain.coop",
            gender: "male",
            referral_source: "O9",
            iban: "ES59 0128 8425 8177 2932 2853",
            iban_valid: true,
            is_physical: null,
            language: "es_ES",
            legal_person_accepted: false,
            name: "Monkey",
            nif: "17891625V",
            payment_method: "iban",
            person_type: "physic-person",
            phone: "666666666",
            phone_code: "+34",
            phone_valid: true,
            privacy_policy_accepted: true,
            proxyname: "",
            proxynif: "",
            proxynif_valid: false,
            sepa_accepted: true,
            surname1: "D",
            surname2: "Luffy",
            terms_accepted: true
        },
        urlok: "https://www.somenergia.coop/es/4321/",
        urlko: "https://www.somenergia.coop/es/1234/"
    },
    normalizedData: {
        tipuspersona: "fisica",
        nom: "Monkey",
        cognom: "D Luffy",
        dni: "17891625V",
        tel: "+34 666666666",
        email: "random@domain.coop",
        cp: "17005",
        provincia: 20,
        adreca: "Avinguda de Sant Narcís, 24 C 1 1",
        municipi: 5386,
        idioma: "es_ES",
        payment_method: "remesa",
        payment_iban: "ES59 0128 8425 8177 2932 2853",
        urlok: "https://www.somenergia.coop/es/4321/",
        urlko: "https://www.somenergia.coop/es/1234/",
        referral_source: "O9",
        gender: "male",
        birthdate: "1994-08-31",
        statutes_accepted: undefined,
        privacy_policy_accepted: undefined,
        comercial_info_accepted: undefined
    }
}

const newNewMemberJuridical = {
    entryValues: {
        address: {
            bloc: "C",
            city: { id: 5386, name: "Girona" },
            door: "1",
            floor: "1",
            has_different_address: null,
            number: "24",
            postal_code: "17005",
            stairs: "B",
            state: { id: 20, name: "Girona" },
            street: "Avinguda de Sant Narcís"
        },
        generic_especific_conditons_accepted: false,
        is_client: null,
        new_member: {
            become_member: false,
            birthdate: null,
            comercial_info_accepted: true,
            email: "random@domain.coop",
            email2: "random@domain.coop",
            gender: "",
            referral_source: "O9",
            iban: "ES59 0128 8425 8177 2932 2853",
            iban_valid: true,
            is_physical: null,
            language: "es_ES",
            legal_person_accepted: true,
            name: "What?",
            nif: "J06006787",
            payment_method: "iban",
            person_type: "legal-person",
            phone: "666666666",
            phone_code: "+34",
            phone_valid: true,
            privacy_policy_accepted: false,
            proxyname: "Benji",
            proxynif: "11111111H",
            proxynif_valid: false,
            sepa_accepted: true,
            surname1: "",
            surname2: "",
            terms_accepted: true,
        },
        urlko: "https://www.somenergia.coop/es/4321/",
        urlok: "https://www.somenergia.coop/es/1234/"
    },
    normalizedData: {
        tipuspersona: "juridica",
        nom: "What?",
        dni: "J06006787",
        tel: "+34 666666666",
        email: "random@domain.coop",
        cp: "17005",
        provincia: 20,
        adreca: "Avinguda de Sant Narcís, 24 C 1 1",
        municipi: 5386,
        idioma: "es_ES",
        payment_method: "remesa",
        payment_iban: "ES59 0128 8425 8177 2932 2853",
        urlok: "https://www.somenergia.coop/es/1234/",
        urlko: "https://www.somenergia.coop/es/4321/",
        representant_nom: "Benji",
        representant_dni: "11111111H",
        referral_source: "O9",
        statutes_accepted: undefined,
        privacy_policy_accepted: undefined,
        comercial_info_accepted: undefined
    }
}


const memberCases = {
    base: base,
    newMember: newMember,
    newNewMemberPhisical: newNewMemberPhisical,
    newNewMemberJuridical: newNewMemberJuridical,
}

export default memberCases