# Flux: Holder Change

El flux actiu és `NewHolderChange`; el container antic `HolderChange` i les rutes que el servien s'han eliminat. La neteja també ha mogut peces reutilitzades a `shared/` sense canviar-ne el contingut.

## Quick path

1. Comença a `src/containers/NewHolderChange/NewHolderChange.jsx`.
2. Consulta `src/containers/NewHolderChange/pages/` per als passos i `src/containers/NewHolderChange/validations/` per les validacions.
3. Si canvies payload o enviament, revisa `newNormalizeHolderChange()` i `createHolderChangeRequest()`.

## Detalls

| Tema            | Context                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------- |
| Container arrel | `src/containers/NewHolderChange/NewHolderChange.jsx`                                        |
| Ruta            | `/:language/formuario-cambio-titular`, registrada a `src/App.jsx`                           |
| Flux            | multi-step amb pàgines a `src/containers/NewHolderChange/pages/`                            |
| Validació       | schemas separats i ordenats per pas al container                                            |
| Casos especials | morts, fusions, electrodependència i adjunts obligatoris                                    |
| Enviament       | crea la sol·licitud; pot continuar amb pagament Redsys o signatura abans del resultat final |
| Codi compartit  | `PersonalData`, `Review` i `StateCity` viuen a `src/containers/shared/`                     |

## Diagrama ràpid

```text
0 Punt de subministrament
  -> 1 Pregunta sobre soci
  -> 2 Identificació del titular
  -> 3 Dades personals
  -> 4 Casos especials
  -> 5 Donació voluntària
  -> 6 Pagament
  -> 7 Resum
       +--> crear sol·licitud
       +--> Redsys o signatura, segons la resposta
  -> resultat d'èxit o error
```

## Riscos reals

- El flux antic i la seva ruta `/holder-change` ja no existeixen; no s'han de documentar com a alternatives actives.
- El pas de resum pot obrir-se des d'un camp concret; el pas següent habitual no sempre és el resum.
- L'enviament pot requerir una fase de pagament o de signatura abans de completar-se.

## Checklist

- [ ] Has revisat el pas i el schema corresponent.
- [ ] Si hi ha adjunts, has comprovat les regles per tipus de motiu.
- [ ] Has verificat el resum i el payload final, incloent pagament/signatura si aplica.

## Subdivisió útil

- `holder-change/README.md`: índex del flux.
- `holder-change/navigation.md`: salts de pas, `skipStep` i navegació real.
- `holder-change/special-cases.md`: motius especials, adjunts i validacions condicionals.
- `holder-change/submit-and-errors.md`: normalització, enviament i tractament d'errors.
