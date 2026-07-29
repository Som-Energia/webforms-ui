# Holder Change: Submit I Errors

La part final d'aquest flux no és només enviar: també construeix errors semàntics a partir de la resposta del backend.

## Quick path

1. Revisa `handlePost()`, `handleError()` i `normalizeHolderChange()`.
2. Mira com `completed`, `error` i `result` governen la UI final.
3. Si canvies validació final, revisa també `validateStep()`.

## Detalls

| Tema | Context |
|---|---|
| Payload | es prepara amb `normalizeHolderChange(values)` |
| Submit | es fa via `holderChange(data)` |
| Error mapping | `handleError()` combina `error.code` i `invalid_fields` per generar un codi més específic |
| UI final | mostra `Success` o `Failure` segons estat |

## Checklist

- [ ] Si canvies submit, has revisat també el mapeig d'errors.
- [ ] Has verificat el camí de backend amb `invalid_fields`.
- [ ] Has comprovat que `activeStep` i `completed` continuïn coherents després d'error o èxit.
