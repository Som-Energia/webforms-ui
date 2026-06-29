# Formularis Nous

Quan toques `Gurb` o `NewContractMember`, assumeix primer que ets dins dels formularis nous del projecte. Aquests fluxos segueixen el patró més alineat amb la manera actual de treballar de l'equip.

## Quick path

1. Si la ruta cau sota `webFormsTheme` i porta `LoadingContextProvider` + `SummaryContextProvider`, sospita que és dels formularis nous.
2. Si el flux usa `components/Buttons/*`, `SomStepper` i `useSyncLanguage`, tracta'l com a formulari nou.
3. Abans d'introduir patrons antics, mira com ho fan `NewContractMember` i `Gurb`.

## Senyals Dels Formularis Nous

| Senyal | Què indica |
|---|---|
| `ThemeWrapper theme={webFormsTheme}` | flux de la capa visual nova |
| `LoadingContextProvider` + `SummaryContextProvider` | patró dels formularis nous amb estat transversal de càrrega i resum |
| `components/Buttons/PrevButton|NextButton|SubmitButton` | ús de botons nous, no `OldComponents` |
| `SomStepper` | stepper compartit dels formularis nous |
| `useSyncLanguage(language)` | sincronització d'idioma integrada al flux |
| containers com `NewContractMember`, `Gurb`, `NewMember` | família de formularis més alineada amb el patró actual |

## Fluxos que avui encaixen millor aquí

- `src/containers/NewContractMember/NewContractMember.jsx`
- `src/containers/Gurb/GurbFormRequirements.jsx`
- `src/containers/Gurb/GurbFormJoin.jsx`
- `src/containers/NewMember/NewMember.jsx`

## Què evitar quan hi entres

- No copiïs per defecte patrons d'`OldComponents` o de fluxos antics com `HolderChange`, `Contribution` o parts d'`Indexed`.
- No barregis botons nous i antics al mateix flux sense una raó clara.
- No moguis lògica al vell patró només perquè existeix en altres zones del repo.

## Com treballar-hi

1. Preserva `webFormsTheme`, `SomStepper`, botons nous i els providers existents.
2. Si afegeixes un pas, revisa també resum, tracking, idiomes i submit extern.
3. Si extreus una peça compartida, comprova primer si la necessiten altres formularis nous, no els antics.

## Checklist

- [ ] Has confirmat si el flux és dels formularis nous o del patró antic.
- [ ] Si és dels formularis nous, has pres com a referència `NewContractMember` o `Gurb` abans de decidir l'enfoc.
- [ ] No has introduït `OldComponents` ni patrons antics sense necessitat real.
