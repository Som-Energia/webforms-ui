# Change Log

## unreleased

- Remove avis autonom and their translations

## 2.0.0 2024-07-04

- Migration from muiv4 to muiv5
- Upgrade notes:
  - Reinstall dependencies

## 1.11.3 2024-06-26

- Changes in CCEE
- Fix: broken eslint-react-app dependency

## 1.11.2 2024-06-26

- Fixed urls in translations

## 1.11.1 2024-06-13

- Remove maj warning: "mecanisme d'ajust al gas" 

## 1.11.0 2024-04-23 

- Add functionality: Add and remove contracts in generationkwh assignments

## 1.10.10 2024-04-22

- Fix: text of the input of NIF in generationkWh's form

## 1.10.9 2024-04-02

- Fix: TAR_2.0TD_SOM_INSULAR to TAR_20TD_SOM_INSULAR
- Fix: Contract: not sending `max_power` as float to prices API
- Fix: Contract: missnamed `particular_contract_terms_accepted`
- Fix: HolderChange: inactive CUPS properly reported to users

## 1.10.8 2024-02-20

- Add contract tariff in generation assignments
- Fix: add `postal_code` validation length

## 1.10.7 2024-02-19

- Fix Holder Change: Member information not sent from ui to api
  for homeowners communities

## 1.10.6 2024-01-24

- Fix cadastral reference is not required

## 1.10.5 2024-01-18

- In-edit validation of Cadastral reference
- In-edit validation of CAU
- Abstracted field ApiValidatedField for Cadastral reference, IBAN and CAU

## 1.10.4 2024-01-09

- Add link to section Production and Consumption of Generation kWh

## 1.10.3 2023-12-18

- Add feature flag to disable contract d1 power modification

## 1.10.2 2023-11-23

- Improve understanding of the contribution form in generationkwh

## 1.10.1 2023-11-20

- Fix Signaturit creation in GenerationKwh form without limit

## 1.10.0 2023-11-16

- Added new GenerationkWh form without limit in number of actions

## 1.9.8 2023-10-16

- Update CCGG and CCEE: SOLS -> Sols

## 1.9.7 2023-10-09

- Fix CCGG html language
- Update CCEE indexed in eu

## 1.9.6 2023-10-05

- Update general conditions html

## 1.9.5 2023-10-05

- Update cancellation terms
- HolderChange: Add link to support center
at `CIF_COMMUNITY_OWNERS` html message.

## 1.9.4 2023-09-22

- Generation kwh form: Signaturit

## 1.9.3 2023-09-15

- HolderChange: Recover tariff type for specific conditions
- HolderChange: Remove old implementation to get tariff_type from OV
- Indexed: Errors on contract state are not fatal just shown
  in the first info page, not with the dead firefly
- Indexed: Fix errors handling dangerouslySetInnerHTML

## 1.9.2 2023-09-08

- Generation kwh form: Path for non partners (still hidden)

## 1.9.1 2023-09-04

- Fix general conditions for holderchange form
- Adapt form to recover backend exceptions
- Fix neighbor communities, they cannot become members

## 1.9.0 2023-08-29

- Generation kwh form: Path for partners (still hidden)

## 1.8.2 2023-08-23

- Fix: The way to sort the list of assignments, when there are low contracts
- Fix: Indexed test with the new condition IsIndexedPilotOngoing

## 1.8.1 2023-08-07

- Fix: error message when contract with custom tariff try to change tariff

## 1.8.0 2023-07-18

- Added the new investments table
- Added the new assignments table
- New Action: Partners can modify the priority of their assignments using drag and drop

## 1.7.7 2023-07-17

- Fix: Remove visible debuging text in interface
- Fix: No power limit in 3.0TD
- TextLoader takes language from i18next context by default
- Use LegalText component in on holderchange and cancellation
- Unified formatting among translations
- Unwrapped paragraphs so that they are the same line independent
  of the language and weblate identifies them
- Fix: document on some languages had a broken xml structure
- index items moved from h6 to h4 to made general-terms and
  general-and-indexed to be diffable in order to spot changes.

## 1.7.6 2023-07-10

- Added `REACT_APP_FEATURE_FLAGS` configuration variable containing a json with feature flags

## 1.7.5 2023-07-05

- Fix: Missing kCoeffient
- Fix: Replace K by F in especific conditions
- Fix: links and texts related with 6.1TD

## 1.7.4 2023-06-28

- Contract form: Add cadastral reference to supply point
- Upgrade notes:
  - Contract attribute isCadastralReference to display cadastral reference field

## 1.7.3 2023-06-27

- Contract form: Adding Chooser for indexed or period tariff
- Contract form tests fixed
- TextLoader/LegalText components for html based translated texts
- Upgrade notes:
  - Contract component attribute isIndexedContractEnabled to toggle the indexed chooser

## 1.7.2 2023-06-08

- Conditionally show pilot test check

## 1.7.1 2023-06-06

- Fix: General and particular terms were not sent in post
- Fix: Indexed pilot terms check was removed beforehand

## 1.7.0 2023-06-06

- Change a contract to periods

## 1.6.0 2023-05-24

- First logged release
- Reenable 3.0TD contracts by default
