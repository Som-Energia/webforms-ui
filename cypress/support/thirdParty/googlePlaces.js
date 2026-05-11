Cypress.Commands.add('interceptGooglePlaces', (street, ) => {

  cy.intercept('POST', '**/google.maps.places.v1.Places/AutocompletePlaces', {
    statusCode: 200,
    body:

      [
        [
          [
            [
              "places/Eh1BdmluZ3VkYSBkZSBNb250aWxpdmksIEdpcm9uYSIuKiwKFAoSCWlKhkzT5roSEYwIiZkve_kaEhQKEgmr_ciYJ-e6EhFvaimltkU4rw",
              "Eh1BdmluZ3VkYSBkZSBNb250aWxpdmksIEdpcm9uYSIuKiwKFAoSCWlKhkzT5roSEYwIiZkve_kaEhQKEgmr_ciYJ-e6EhFvaimltkU4rw",
              [
                street,
                [
                  [
                    12,
                    21
                  ]
                ]
              ],
              [
                "route",
                "geocode"
              ]
            ]
          ]
        ]
      ]

  })

  cy.intercept(
  'POST',
  '**/google.maps.places.v1.Places/GetPlace',
  {
    statusCode: 200,
    body: {
      id: 'abc123',
      displayName: {
        text: 'Barcelona'
      },
      formattedAddress: 'Barcelona, Spain',
      location: {
        latitude: 41.3874,
        longitude: 2.1686
      }
    }
  }
).as('getPlace')
})