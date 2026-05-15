Cypress.Commands.add('interceptGooglePlaces', (autoCompleteResponse, placeResponse ) => {

  cy.intercept(
    'POST', 
    '**/google.maps.places.v1.Places/AutocompletePlaces',
    {
        statusCode: 200,
        body: autoCompleteResponse
    }
    ).as('googleAutocomplete')

  cy.intercept(
    'POST',
    '**/google.maps.places.v1.Places/GetPlace',
    {
        statusCode: 200,
        body: placeResponse
    }
    ).as('googleGetPlace')

})