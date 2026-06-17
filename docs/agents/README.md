# Context Per Agents

Documents curts per carregar només el context necessari abans d'editar codi.

## Ruta ràpida

1. Llegeix `00-workflow.md` abans de tocar res.
2. Afegeix `01-arquitectura.md` si has de localitzar on viu una feature.
3. Afegeix `02-formularis-i-validacio.md` si tocaràs fluxos multi-step, `Formik` o `Yup`.
4. Afegeix `03-testing.md` si has de verificar canvis.
5. Afegeix `04-i18n.md` si canvies text, idioma o rutes localitzades.
6. Afegeix `05-build-i-execucio.md` si has d'executar localment, testejar o fer build.
7. Afegeix `06-integracions.md` si toques API, analytics o Google Places.
8. Afegeix `07-formularis-nous.md` si toques Gurb, contractació o altres formularis nous.
9. Afegeix `flows/README.md` si el canvi pertany a un flux funcional concret.

## Index

| Fitxer | Quan llegir-lo |
|---|---|
| `00-workflow.md` | Sempre, abans d'editar |
| `01-arquitectura.md` | Quan necessites orientació del repo |
| `02-formularis-i-validacio.md` | Quan toques formularis o passos |
| `03-testing.md` | Quan has d'afegir o revisar proves |
| `04-i18n.md` | Quan canvies textos o llengua |
| `05-build-i-execucio.md` | Quan has d'arrencar, lintar o construir |
| `06-integracions.md` | Quan toques serveis externs |
| `07-formularis-nous.md` | Quan toques els formularis nous alineats amb el patró actual de l'equip |
| `flows/README.md` | Quan vols context específic d'un flux funcional |

## Referencies base

- `README.md`: arrencada, scripts i notes generals.
- `CHANGES.md`: historial funcional del producte.
- `AGENTS.md`: convencions de git i normes de treball del projecte.

## Manteniment

- Aquests docs s'han d'actualitzar dins la mateixa branca quan un canvi de codi o de workflow els deixi desalineats.
- També es pot demanar explicitament una revisio de documentacio per detectar context vell o incomplet.
