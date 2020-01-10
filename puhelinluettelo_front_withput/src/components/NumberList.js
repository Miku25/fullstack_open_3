import React from 'react'
import Person from './Person'
import personService from '../services/personService'

const NumberList = ( {persons, personFilter} ) => {

  const removePerson = (id, name) => {
    console.log(`Deleting person with id ${id}`)
    if(window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
            
    }
  }

  return (
    persons.map(person => {
      if (personFilter ==='' || person.name.toLowerCase().includes(personFilter)) {
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
  
export default NumberList

