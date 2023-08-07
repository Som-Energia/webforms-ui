# Change Log

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
