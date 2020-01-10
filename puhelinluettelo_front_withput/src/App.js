import React, { useState, useEffect } from 'react'
import NewInput from './components/NewInput'
import personService from './services/personService'
import Person from './components/Person'


const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('New Person')
  const [ newNumber, setNewNumber ] = useState('050-1234567')
  const [ personFilter, setFilter ] = useState('')
  const [ successMessage, setSuccessMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const SuccessMessage = () => {
    const successMessageStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }

    if (successMessage === null) {
      return null
    }

    return (
      <div style={successMessageStyle}>
        {successMessage}
      </div>
    )
  }

  const ErrorMessage = () => {
    const errorMessageStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }

    if (errorMessage === null) {
      return null
    }

    return (
      <div style={errorMessageStyle}>
        {errorMessage}
      </div>
    )
  }

  const NumberList = ( {persons, personFilter} ) => {

    const removePerson = (id, name) => {
      console.log(`Deleting person with id ${id}`)
      if(window.confirm(`Delete ${name}?`)) {
        personService.remove(id)
        alertSuccess(`${name} was removed`)
        setPersons(persons.filter(p => p.id !== id))
      }
    }

    return (
      persons.map(person => {
        if (personFilter ==='' || person.name.toLowerCase().includes(personFilter.toLowerCase())) {
          return (
            <Person
              key={person.id}
              person={person}
              removePerson={() => removePerson(person.id, person.name)}
            />
          )
        } else {
          return ('')
        }
      })
    )
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const addDetails = (event) => {
    event.preventDefault()
    const personObject = {
      name : newName,
      number : newNumber,
    }
    if ( !(persons.map(person => person.name).indexOf(newName) > -1 )) {
      personService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          alertSuccess(`Added ${returnedPerson.name}`)
        })
        .catch(error => {
          alertError(`${error.response.data.error}`)
        })
    } else {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.filter(person => person.name === personObject.name)
        const newPerson = {
          name: personObject.name,
          number: personObject.number,
          id: oldPerson[0].id
        }

        personService.update(newPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === returnedPerson.id
              ? returnedPerson
              : person
            ))
            alertSuccess(`Added ${returnedPerson.name}`)
          })
      }
    }
    setNewName('')
  }

  const alertSuccess = (text) => {
    setSuccessMessage(text)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const alertError = (text) => {
    setErrorMessage(text)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessMessage />
      <ErrorMessage />
      <NewInput text={'filter shown with'} value={personFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <form onSubmit={addDetails}>
        <NewInput text={'name'} value={newName} onChange={handleNameChange} />
        <NewInput text={'number'} value={newNumber} onChange={handleNumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        <NumberList persons={persons} personFilter={personFilter} />
      </ul>
    </div>
  )

}

export default App