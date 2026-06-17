# New Contract Member: Pagament I Submit

El submit final no només envia el formulari: pot acabar en resultat local o en un salt a Redsys.

## Quick path

1. Revisa `handlePost()` i `trackSucces()` a `src/containers/NewContractMember/NewContractMember.jsx`.
2. Mira `newNormalizeContract(values, gurbCode)`.
3. Verifica el camí amb i sense `response.data.redsys_endpoint`.

## Detalls

| Tema | Context |
|---|---|
| Tracking d'enviament | event `sendNewContractMemberClick` abans de submit |
| Payload | normalització amb `gurbCode` com a context addicional i selecció entre `linked_member_info`, `new_member_info` i `contract_owner` |
| Resposta èxit | si hi ha `redsys_endpoint`, prepara formulari i envia cap a pagament |
| Resposta èxit sense pagament | marca `completed` i mostra resultat final |
| Context extra | pot disparar trackers específics per `gurb_id`, `mtm_cid`, `mtm_source` i `language` |
| Resultat Gurb | si hi ha `gurbCode` i no hi ha error, mostra `RedirectUrl` en lloc del resultat estàndard |

## Decisions de payload que solen passar desapercebudes

- `linked_member` pot acabar sent `already_member`, `sponsored` o `new_member`.
- `campaign-offer` es normalitza com a cas patrocinat.
- `has_light` i `previous_holder` determinen el `process` (`A3`, `C1`, `C2`).
- `has_selfconsumption` decideix si s'envia `self_consumption`.
- si hi ha adjunts al punt de subministrament, es converteixen a `attachments` amb categoria dependent del procés.

## Checklist

- [ ] Has comprovat tots dos camins d'èxit: amb Redsys i sense Redsys.
- [ ] Si toques tracking, has revisat tant `trackSucces()` com els events per pas.
- [ ] Si toques payload, has verificat quin dels tres models personals surt realment: `linked_member_info`, `new_member_info` o `contract_owner`.
- [ ] Si toques resultat final, has verificat la branca específica de `gurbCode`.
