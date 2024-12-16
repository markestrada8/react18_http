import { useEffect, useState } from 'react'
import Places from './Places.jsx'
import ErrorPage from './Error.jsx'
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js'
// let count = 1

export default function AvailablePlaces({ onSelectPlace }) {
  const [places, setPlaces] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    async function getPlaces() {
      try {

        const placeData = await fetchAvailablePlaces()
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(placeData, position.coords.latitude, position.coords.longitude)
          setPlaces(sortedPlaces)
          setIsLoading(false)
        })


      } catch (error) {
        setError({
          message: error.message || "Error retrieveing data. Please try again later."
        })
        setIsLoading(false)
      }
    }
    getPlaces()

  },
    [])

  // useEffect(() => {
  //   setIsLoading(true)
  //   fetch('http://localhost:3000/places')
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch data.')
  //       }
  //       return res.json()
  //     })
  //     .then(data => {
  //       const { places } = data

  //       navigator.geolocation.getCurrentPosition((position) => {
  //         const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)
  //         setPlaces(sortedPlaces)
  //         setIsLoading(false)
  //       })



  //     })
  //     .catch(err => {
  //       setError({
  //         message: err.message || "Error occured retrieving data, please try again later."
  //       })
  //       setIsLoading(false)
  //     })

  // }, [])

  if (error) {
    return <ErrorPage
      title="An error occured!"
      message={error.message}
    />
  }

  // const tracker = () => {
  //   console.log(`${count} - ${places}`)
  //   count++
  // }

  // tracker()
  return (
    <Places
      title="Available Places"
      places={places}
      isLoading={isLoading}
      loadingText="Fetching places data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  )
}
