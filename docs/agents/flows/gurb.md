# Flux: Gurb

Gurb no és només dos formularis separats. És un flux compost amb possible bucle extern: `requirements -> contractació -> pagament de contractació -> retorn a join Gurb`.

## Quick path

1. Si valides elegibilitat, comença a `src/containers/Gurb/GurbFormRequirements.jsx`.
2. Si gestiones adhesió i pagament, comença a `src/containers/Gurb/GurbFormJoin.jsx`.
3. Si canvies el final feliç, revisa també `pages/Gurb/GurbContractPaymentSuccessful.jsx`.

## Detalls

| Tema | Context |
|---|---|
| Requisits | flux de 4-5 passos amb resultat final i possible redirecció a nova contractació |
| Adhesió | flux de 4 passos amb identificació, participació, revisió i signatura |
| Params | usa `language`, `gurbCode` o `code` segons la ruta |
| Validació | schemas propis a `validations/GurbValidations` i `validations/requirementsValidations` |
| Tracking | Matomo per passos de requisits i adhesió |
| Pagament | adhesió acaba enviant un formulari ocult a Redsys després de signatura vàlida |

## Bucle important

1. `requirements` pot concloure que la persona ha d'anar a contractació.
2. Aquesta sortida construeix una URL de contractació amb `?gurb-code=<codi>`.
3. `NewContractMember` conserva aquest context i envia `gurb_code` al payload.
4. Si la contractació passa per TPV, l'èxit acaba a `/:language/gurb/gurb-url-ok?gurbCode=<codi>`.
5. Aquesta pantalla redirigeix de nou a `/:language/gurb/<codi>/join/` perquè la persona continuï l'adhesió Gurb.

```text
/:language/gurb/:gurbCode/requirements/
        |
        | si pot continuar directament
        v
/:language/gurb/:code/join/
        |
        | signatura + TPV propi de join
        v
      adhesio Gurb

        o

/:language/gurb/:gurbCode/requirements/
        |
        | si cal nova contractacio
        v
/:language/formulari-contractacio-*/?gurb-code=<codi>
        |
        | NewContractMember envia gurb_code
        | i pot fer TPV de contractacio
        v
/:language/gurb/gurb-url-ok?gurbCode=<codi>
        |
        | redirect button
        v
/:language/gurb/:code/join/
```

## Riscos reals

- Confondre `gurbCode` i `code` segons el subflux.
- Trencar la transició entre requisits, contractació i retorn a `join`.
- Tocar signatura o pagament sense revisar el `form` ocult que fa `POST` a Redsys.

## Checklist

- [ ] Has identificat si el canvi és de requisits o d'adhesió.
- [ ] Has comprovat si el canvi afecta també la volta externa per contractació.
- [ ] Si toques signatura/pagament, has revisat `validSignature`, `redsysData` i el submit final.
- [ ] Si toques requisits, has revisat condicions que bloquegen `NextButton`.

## Subdivisió útil

- `gurb/README.md`: índex del flux.
- `gurb/requirements.md`: elegibilitat, resultat i transició a nova contractació.
- `gurb/join.md`: adhesió, signatura i pagament.
