import { Loader } from '@googlemaps/js-api-loader'

/**
 * This is a wrapper around the Google Maps API client.
 * see https://developers.google.com/maps/documentation/javascript
 */

/** @var {google.maps.PlacesLibrary|undefined} */
let placesApiClient

export default async function getGoogleMapsPlacesApiClient() {
  if (placesApiClient) {
    return placesApiClient
  }

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_JAVASCRIPT_API_KEY,
    version: 'beta'
  })

  placesApiClient = await loader.importLibrary('places')

  return placesApiClient
}

export async function getPlaceDetails(placeId, sessionTokenRef) {
  const { Place } = await getGoogleMapsPlacesApiClient()

  // Clear the session token, it can only be used in one request
  const sessionToken = sessionTokenRef.current
  sessionTokenRef.current = undefined

  // @see https://developers.google.com/maps/documentation/javascript/place-details
  const place = new Place({
    id: placeId,
    sessionToken,  // pass the session token so all autocomplete requests are counted as part of this places request
  })
  await place.fetchFields({
    fields: ["formattedAddress", "location", "addressComponents"]
  })
  return place
}

export async function searchPlace(string, sessionTokenRef) {
  const places = await getGoogleMapsPlacesApiClient() // TODO: with {}
  if (!sessionTokenRef.current) {
    sessionTokenRef.current = new places.AutocompleteSessionToken()
  }

  let request = {
    region: 'es',
    sessionToken: sessionTokenRef.current,
    input: string,
    includedPrimaryTypes: ['route'],
    includedRegionCodes: ['es'],
  }
  const result = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
  let placesSuggestions = []
  for (let suggestion of result?.suggestions) {
    const placePrediction = suggestion.placePrediction
    placesSuggestions.push({
      id: placePrediction.placeId.toString(),
      text: placePrediction.text.toString()
    })
  }
  return placesSuggestions
}
