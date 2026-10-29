# Holder Change: Submit I Errors

La part final crea una sol·licitud i pot continuar amb pagament Redsys o signatura; l'antic mapeig detallat d'errors ja no forma part del flux actiu.

## Quick path

1. Revisa `handleCreateContract()`, `handleSignatureSuccess()` i `newNormalizeHolderChange()` a `src/containers/NewHolderChange/NewHolderChange.jsx`.
2. Comprova els camins Redsys (`redsys_data`) i signatura (`lead_id`).
3. Verifica el resultat final amb els estats `completed` i `error`.

## Detalls

| Tema      | Context                                                                                       |
| --------- | --------------------------------------------------------------------------------------------- |
| Payload   | es prepara amb `newNormalizeHolderChange(values)`                                             |
| Creació   | `createHolderChangeRequest(data)` pot retornar dades de pagament o un `lead_id` per signatura |
| Redsys    | el formulari de pagament s'envia automàticament quan hi ha endpoint i dades                   |
| Signatura | `executeRequest(requestId, cups)` completa la sol·licitud després de la signatura             |
| UI final  | `Result` mostra èxit o error segons `completed` i `error`                                     |

## Checklist

- [ ] Si canvies submit, has revisat també el mapeig d'errors.
- [ ] Has verificat el camí de backend amb `invalid_fields`.
- [ ] Has comprovat que `activeStep` i `completed` continuïn coherents després d'error o èxit.
