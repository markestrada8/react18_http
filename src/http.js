export async function fetchAvailablePlaces() {
  const response = await fetch('http://localhost:3000/places')
  const { places } = await response.json()
  if (!response.ok) {
    throw new Error('Failed to fetch data.')
  }
  return places
}

export async function updateUserPlaces(data) {
  const response = await fetch('http://localhost:3000/user-places', {
    method: "PUT",
    body: JSON.stringify({ places: data }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const resData = await response.json()

  if (!response.ok) {
    throw new Error('Failed to update user data.')
  }

  return resData.message
}

export async function fetchUserPlaces() {
  const response = await fetch('http://localhost:3000/user-places')
  const { places } = await response.json()
  if (!response.ok) {
    throw new Error('Failed to fetch data.')
  }
  return places
}