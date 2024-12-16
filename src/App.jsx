import { useRef, useState, useCallback, useEffect } from 'react'

import Places from './components/Places.jsx'
import Modal from './components/Modal.jsx'
import DeleteConfirmation from './components/DeleteConfirmation.jsx'
import logoImg from './assets/logo.png'
import AvailablePlaces from './components/AvailablePlaces.jsx'
import ErrorPage from './components/Error.jsx'

import { fetchUserPlaces, updateUserPlaces } from './http.js'

function App() {
  const selectedPlace = useRef()

  const [userPlaces, setUserPlaces] = useState([])
  const [errorUpdating, setErrorUpdating] = useState()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  // STATE HANDLERS
  function handleStartRemovePlace(place) {
    setModalIsOpen(true)
    selectedPlace.current = place
  }


  function handleStopRemovePlace() {
    setModalIsOpen(false)
  }

  // ASYNC API HANDLERS
  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = []
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces
      }
      return [selectedPlace, ...prevPickedPlaces]
    })

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces])
    } catch (error) {
      setUserPlaces(userPlaces)
      setErrorUpdating({ message: error.message || 'Failed to update places.' })
    }
  }


  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true)
      try {
        const fetchedUserPlaces = await fetchUserPlaces()
        setUserPlaces(fetchedUserPlaces)
      } catch (error) {
        setError({ message: error.message || 'Failed to fetch user data.' })
      }
      setIsLoading(false)
    }
    fetchPlaces()
  }, [])


  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    )
    try {
      await updateUserPlaces(userPlaces.filter(place => place.id !== selectedPlace.current.id))

    } catch (error) {
      setUserPlaces(userPlaces)
      setErrorUpdating({ message: error.message || 'Failed to delete item.' })
    }
    setModalIsOpen(false)
  }, [userPlaces])

  // ERROR HANDLERS
  function handleError() {
    setErrorUpdating(null)
  }

  return (
    <>
      <Modal open={errorUpdating} onClose={handleError}>
        {errorUpdating && <ErrorPage
          title="An error occured"
          message={errorUpdating.message}
          onConfirm={handleError}
        />}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <ErrorPage title="An error occured" message={error.message} />}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          loadingText="Fetching data..."
          isLoading={isLoading}
          onSelectPlace={handleStartRemovePlace}
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  )
}

export default App
