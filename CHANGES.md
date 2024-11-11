# Change Log

## 2.4.1 2024-11-11
- Added message for autonomous (Modify Contract form)
- Added feature flag: noticeAutonomous

## 2.4.0 2024-11-06

- Use new prices entry point
- Remove old new-member urls

## 2.3.17 2024-11-05

- New entry points for the renamed new-member form urls 

## 2.3.16 2024-11-04

- Removed google tracking
- Fix: CAU helper text when untouched was required error and not the help.
- Fix: Infinite loop on remote CAU validation
- Fix: Recovered pretty format on CAU, IBAN and Cadaster
- Fix: Recovered the Checking... message and spiner in CAU, IBAN, Cadaster
- CI for the unit test (TODO: ci for cypress)
- CI activated chat notifications

## 2.3.15 2024-10-22

- Fix: Was forcing cau-cups matching in the wrong case (collective)

## 2.3.14 2024-10-22

- Fix: link_member value when member is not mandatory for holderchange

## 2.3.13 2024-10-21

- Translations: New CAU validation errors (missing GL)
- Translations: Missing EU translations

## 2.3.12 2024-10-17

- Fix: CAU code validation
    - TDD rewritten code (inspired on the old one but adding it progressively to fail every test)
    - Fix: Partial match now complaints on length not on unmatching cups
    - Fix: Now verifies locally that 18 numbers follow after 'ES'
    - Complaints on bad partially written border points and installation
    - Corrects spurious spaces from user
    - Corrects lowercases into upper cases from user
- Usability: filter out unaccepted chars in member number from input
    - Avoids among other problems, the one produced when pasting
    numbers from comunications with milliard dots like 99.999,
    trailing spaces and the 'S' character.

## 2.3.11 2024-10-17

- Refactor and encapsulate matomo 

## 2.3.10 2024-10-03

- Cypress: Fix all tests and imrpove coverage
- Cypress: Mocked calls of Generation and modify Tariff
- Add github action to check the version of dependecies
- Add test for normalize function with jest

## 2.3.9 2024-09-30

- Added VITE feature flag: isMemberMandatoryForHolderchange
- Changes in HolderChange form:
  - When feature flag is disabled, member is not required (trial period)
  - Behaviour does not change if the feature flag is enabled
- Upgrade notes:
    - isMemberMandatoryForHolderchange in VITE_FEATURE_FLAGS in `.env.*`

## 2.3.8 2024-07-27

- Validations forms
- Improve test coverage

## 2.3.7 2024-08-27

- Deploy script unified with somrepre
- New tag based version string
- New linter command
- Fix: escaping url params (security)
- Fix: undefined not properly managed in attachments

## 2.3.6 2024-08-27

- Force CAU to match CUPS in single installs

## 2.3.5 2024-08-23

- Matomo funnels tracking for Contract and NewMember forms
- Upgrade notes:
    - VITE_MATOMO_URL in `.env.*`

## 2.3.4 2024-08-21

- Fix: Disable next button when error on tariff modification first step

## 2.3.3 2024-08-12

- Fix tariff old names

## 2.3.2 2024-08-06

- Fix tariff names
	
## 2.3.1 2024-07-30

- Fixed some bugs:
  - Chooser as a required field in contract form
  - Fixed chooser text justify content when alignTop
  - Fixed dayjs isoWeek import in Cancellation form

## 2.3.0 2024-07-29

- New address autocomplete with feature flag

## 2.2.0 2024-07-18

- New deploy scripts for wp
- Support different ways of setting WEBFORMS_API_URL for wp and ov
- Moved translation literals inside t() (wip)
- Include jsx files in i18n-lint
- Upgrade notes:
    - webforms-config.js obsolete
    - VITE_API_BASE_URL -> VITE_WEBFORMS_API_URL

## 2.1.0 2024-07-16

- Migrated from cra to vite 
- Remove warning on autonomous workers and related translations
- Upgrade notes:
    - Install from scratch since the build system has change
        - Remove node_modules and package-lock before installing
    - All environment variables changed prefix to VITE_
    - PUBLIC_URL has changed to BASE_URL and requires final slash

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
