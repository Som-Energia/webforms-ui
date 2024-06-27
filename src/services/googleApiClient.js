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
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_JAVASCRIPT_API_KEY,
    version: 'weekly'
  })

  placesApiClient = await loader.importLibrary('places')

  return placesApiClient
}
