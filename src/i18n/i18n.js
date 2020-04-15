import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  ca: {
    translation: {
      SI: 'Sí',
      NO: 'No',
      SEGUENT_PAS: 'Següent pas',
      PAS_ANTERIOR: 'Pas anterior',
      ENVIAR: 'Enviar',
      ENVIANT: 'Enviant',
      SELECCIONA: 'Selecciona',
      CONTRACT_MODIFICATION_FORM: 'Modificacions de potència i/o tarifa',
      MODIFY_POTTAR_INTRO_TITLE: 'Avís important',
      MODIFY_POTTAR_INTRO: '<p>El canvi de potència i/o tarifa el valida, l\'aplica i el cobra (a través de la nostra factura) la <a target="_blank" href={{url}}>distribuïdora de la teva zona</a>. El <b>cost regulat</b> és:</p><ul><li>10,94&nbsp;€ (IVA inclòs) per sol·licitud. Podeu canviar alhora de tarifa i potència en una sola sol·licitud.</li><li>En cas d\'<b>augmentar la potència</b>, 44,86&nbsp;€ per kW d\'increment.</li><li>En el cas d\'haver baixat la potència contractada, durant els següents tres anys es podrà tornar augmentar fins el valor anteriorment contractat pagant 23,84 € per kW d\'augment, en comptes dels 44,86 € comentats anteriorment.</li></ul><p>La distribuïdora només està obligada a acceptar <b>una sol·licitud de canvi cada 12 mesos</b> excepte per augments de potència contractada. En aquest cas, per normativa, la distribuidora no podrà aplicar aquesta limitació.</p><p>En cas d\'augmentar la potència contractada la companyia distribuïdora pot demanar el butlletí o certificat de la instal·lació si aquest ja està caducat o si marca una potència inferior a la nova sol·licitada. Si fos així, t\'ho farem saber per correu electrònic.</p>',
      HELP_CONTACT_INFO: 'Les dades de contacte les utilitzarà la <a target="_blank" href="{{url}}">distribuïdora de la zona</a> per avisar-vos en cas que el tècnic encarregat necessiti accedir al comptador.',
      MODIFY_POTTAR_SELECT_TITLE: 'Selecciona la modificiació/modificacions que vols',
      MODIFY_POTTAR_CONTACT_TITLE: 'Dades de contacte, per accedir al comptador',
      HELP_CONTACT_INFO_URL: 'http://ca.support.somenergia.coop/article/655-les-distribuidores-d-electricitat',
      MODIFY_POTTAR_SUCCESS_TITTLE: 'Enhorabona. En breu rebràs un correu electrònic amb les dades de la teva sol·licitud.',
      MODIFY_POTTAR_SUCCESS_MESSAGE: 'Enviarem la teva sol·licitud a la distribuïdora de la teva zona que s’encarregarà de validar-la i fer-la efectiva. En el cas que sigui necessari fer-nos arribar documentació relacionada amb aquesta tramitació, adjunta-la responent al correu de confirmació que rebràs en pocs minuts.',
      ERROR_POST_MODIFY: 'S\'ha detectat un error',
      MODIFY_POTTAR_ONGOING_PROCESS: 'Aquest contracte té un altre procés pendent de resoldre.',
      MODIFY_POTTAR_ONGOING_PROCESS_DETAILS: 'No es poden començar nous processos si n\'hi ha cap de pendent. Torna a intentar-ho un cop hagis rebut per correu la resolució del procés pendent.',
      MODIFY_POTTAR_NOT_ALLOWED: 'No estàs autoritzat a fer aquesta operació.',
      MODIFY_POTTAR_NOT_ALLOWED_DETAILS: 'Vols venir a treballar amb nosaltres? ;-)',
      MODIFY_POTTAR_INACTIVE_CONTRACT: 'El contracte a modificar no està d\'alta.',
      MODIFY_POTTAR_INACTIVE_CONTRACT_DETAILS: 'Només es poden modificar els contractes que estan d\'alta.',
      MODIFY_POTTAR_BAD_TOKEN: 'La sessió ha expirat.',
      MODIFY_POTTAR_BAD_TOKEN_DETAILS: 'Et recomanem tornar a accedir des de la llista de contractes i intentar-ho de nou.',
      MODIFY_POTTAR_UNEXPECTED: 'S\'ha produït un error inesperat.',
      MODIFY_POTTAR_UNEXPECTED_DETAILS: 'Poseu-vos en contacte amb modifica@somenergia.coop per a que us podem donar un cop de mà. Per identificar-vos necessitarem saber el vostre NIF i el número del contracte que voleu modificar.',
      MODIFY_ANSWER_INSTAL_TYPE: 'Vols modificar la tensió?',
      MODIFY_ANSWER_POWER: 'Vols modificar la potència?',
      MODIFY_ANSWER_FARE: 'Vols modificar la tarifa?',
      REVISIO_CONFIRMACIO_DADES: 'Revisió i confirmació de les dades',
      TIPUS_INSTALLACIO: 'Quin tipus d\'instal·lació tens?',
      MONOFASICA_NORMAL: 'Monofàsica (Normal)',
      TRIFASICA: 'Trifàsica',
      HELP_INSTALL_TYPE: 'Com identificar si una instal·lació és <a target="_blank" href="{{url}}">trifàsica o monofàsica</a>',
      HELP_INSTALL_TYPE_URL: 'http://ca.support.somenergia.coop/article/479-tinc-una-instal-lacio-monofasica-o-trifasica',
      POTENCIA_A_CONTRACTAR: 'Quina potència vols contractar?',
      DISCRIMINACIO_HORARIA: 'Vols discriminació horària?',
      SENSE_DISCRIMINACIO_HORARIA: 'Sense discriminació horària',
      HELP_POTENCIA: 'Com esbrinar <a target="_blank" href="{{url}}">la potència que necessito</a>',
      HELP_POTENCIA_URL: 'http://ca.support.somenergia.coop/article/269-com-puc-saber-la-potencia-que-necessito',
      AMB_DISCRIMINACIO_HORARIA: 'Amb discriminació horària',
      HELP_DISCRIMINACIO_HORARIA: 'Com puc saber <a target="_blank" href="{{url}}">si em convé discriminació horària o no</a>',
      HELP_DISCRIMINACIO_HORARIA_URL: 'http://ca.support.somenergia.coop/article/270-com-puc-saber-si-em-surt-a-compte-tenir-discriminacio-horaria',
      NO_MONOPHASE_CHOICE: 'No has especificat si la instal·lació és de tipus monofàsica o trifàsica',
      NO_FARE_CHOSEN: 'No has especificat la tarifa',
      NO_POWER_CHOSEN: 'No has especificat la potència',
      NO_POWER_CHOSEN_P2: 'No has especificat la potència pel període P2',
      NO_POWER_CHOSEN_P3: 'No has especificat la potència pel període P3',
      INVALID_POWER_20: 'La potència per tarifes 2.0 ha de ser inferior a 10kW',
      INVALID_POWER_21: 'La potència per tarifes 2.1 hauria ha d\'estar entre 10kW i 15kW',
      INVALID_POWER_30: 'Al menys un període ha de tenir una potència superior o igual a 15kW',
      NO_HOURLY_DISCRIMINATION_CHOSEN: 'No has especificat si vols fer discriminació horària',
      MES_GRAN_DE_15KW: 'Superior a 15kW',
      NAME: 'Nom',
      SURNAME: 'Cognoms',
      PHONE: 'Telèfon',
      NO_NAME: 'No has especificat el nom',
      NO_SURNAME: 'No has especificat els cognoms',
      NO_PHONE: 'No has especificat un telèfon correcte',
      MODIFY_POTTAR: 'Petició de canvi de Tarifa i/o Potència',
      POWER: 'Potència',
      FARE: 'Tarifa',
      CONTACT_PHONE: 'Telèfon de contacte per accedir al comptador',
      REVIEW_DATA_AND_CONFIRM: 'Reviseu les dades. Per confirmar-les, premeu el botó del final.'
    }
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'ca',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
