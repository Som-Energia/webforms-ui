# Holder Change: Navegació

Aquí la clau és `skipStep()`. Molts errors venen de tocar un pas sense entendre quan es mostra o s'amaga.

## Quick path

1. Comença a `getActiveStep()` i `skipStep()` dins `src/containers/HolderChange.jsx`.
2. Revisa `nextStep()` i `prevStep()`.
3. Verifica el comportament per membre existent, alta nova i comunitat de propietaris.

## Detalls

| Tema | Context |
|---|---|
| Render de passos | `VAT`, `CUPS`, `BecomeMember`, `HolderCase`, `MemberIdentifier`, `PersonalData`, `VoluntaryCent`, `SpecialCases`, `IBAN`, `Review` |
| Salts | `skipStep()` pot ometre sobretot els passos 2, 3 i 4 |
| Condicions clau | `holder.ismember`, `member.become_member`, `member.link_member`, `isMemberMandatoryForHolderchange`, i comunitat de propietaris |

## Checklist

- [ ] Si canvies navegació, has provat avançar i retrocedir.
- [ ] Has revisat l'efecte en comunitats de propietaris.
- [ ] Has verificat si el canvi impacta només passos visibles o també els saltats.
