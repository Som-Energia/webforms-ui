# Gurb: Join

Aquest subflux és l'últim tram de Gurb, però pot ser reprès després d'una sortida prèvia a contractació.

## Quick path

1. Comença a `src/containers/Gurb/GurbFormJoin.jsx`.
2. Si el canvi és de signatura, revisa també `pages/Gurb/GurbSignature.jsx`.
3. Si el canvi és de pagament o retorn des de contractació, mira també `pages/Gurb/GurbContractPaymentSuccessful.jsx`.

## Detalls

| Tema | Context |
|---|---|
| Pasos | `GurbIdentification`, `GurbParticipation`, `ContractReview`, `GurbSignature` |
| Submit visible | el botó final només habilita quan `validSignature` és `true` |
| Tracking | event per pas i event específic `gurb-join-signed-${code}` |
| Pagament real | quan hi ha `redsysData && validSignature && submitAction`, es fa `POST` a Redsys |
| Retorn des de contractació | la ruta `/:language/gurb/gurb-url-ok?gurbCode=...` mostra un èxit i enllaça de nou a `/:language/gurb/{{gurbCode}}/join/` |

## Bucle amb contractació

Si la persona ha hagut de sortir a contractació perquè no tenia el CUPS a Som o necessitava donar-se d'alta/contractar, el retorn a Gurb NO és màgic ni intern a `GurbFormJoin`.

El que existeix al codi és:

1. contractació amb `?gurb-code=...`
2. `NewContractMember` envia `gurb_code`
3. després del pagament de contractació, la ruta `gurb-url-ok` ofereix el retorn a `join`

## Checklist

- [ ] Si canvies la signatura, has comprovat l'efecte sobre `validSignature`.
- [ ] Si canvies el submit, has verificat que el `form` ocult continuï rebent `payment_data`.
- [ ] Si canvies el flux final, has revisat tant el pagament propi de `join` com el retorn des de contractació via `gurb-url-ok`.
