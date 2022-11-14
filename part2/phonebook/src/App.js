import { useEffect, useState } from 'react'
import './app.css'

import personService from './services/persons'

const Notification = ({ message }) => {
  if (message.content === null) {
    return null
  }

  return (
    <div className={message.type}>
      {message.content}
    </div>
  )
}

const Filter = ({ value, handleChange }) => {
  return (
    <div>
      filter shown with <input type="text" value={value} onChange={handleChange} />
    </div>
  )
}

const PersonForm = ({ onSubmit, handleChange, formValues }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>name: <input value={formValues.name} onChange={handleChange} name='name' /></div>
      <div>number: <input value={formValues.number} onChange={handleChange} name='number' /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ persons, onDeletePerson }) => {
  return (
    <div>
      {
        persons.map(person => {
          return (
            <p key={person.name}>
              {`${person.name} ${person.number} `}
              <button onClick={() => { onDeletePerson(person.id, person.name) }}>delete</button>
            </p>
          )
        })
      }
    </div>
  )
}

const initialNewPerson = {
  name: '',
  number: ''
};

const initialNotification = { content: null, type: 'success' }

const App = () => {

  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState(initialNewPerson)
  const [query, setQuery] = useState('')
  const [notification, setNotification] = useState(initialNotification)


  useEffect(() => {

    personService.getAll().then(persons => {
      setPersons(persons);
    })

  }, [])

  const showNotificationForFiveSeconds = (notificationObject) => {
    setNotification(notificationObject)
    setTimeout(() => {
      setNotification(initialNotification)
    }, 5000)
  }

  const handleFilterChange = ({ target }) => setQuery(target.value);

  const handleFormChange = ({ target }) => {
    setNewPerson({
      ...newPerson,
      [target.name]: target.value
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existPerson = persons.find(person => person.name === newPerson.name);

    if (existPerson) {
      if (window.confirm(`${newPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {

        personService.update(existPerson.id, newPerson).then((updatedPerson) => {

          const updatedPersons = persons.map(person => person.id !== existPerson.id ? person : updatedPerson)
          setPersons(updatedPersons)

          setNewPerson(initialNewPerson)

          showNotificationForFiveSeconds({
            content: `The number of ${updatedPerson.name} has been updated`,
            type: 'success'
          })
        })
          .catch(() => {
            showNotificationForFiveSeconds({
              content: `${existPerson.name} was already deleted from the phonebook`,
              type: 'error'
            })

            setPersons(persons.filter(person => person.id !== existPerson.id))
          })
      }
    } else {
      personService.create(newPerson).then(newPerson => {
        setPersons([...persons, newPerson])
        setNewPerson(initialNewPerson);
        showNotificationForFiveSeconds({
          content: `${newPerson.name} has been added to the phonebook`,
          type: 'success'
        })
      })

    }


  }

  const handleDeletePerson = (id, name) => {

    if (window.confirm(`Delete ${name}`)) {
      personService.deletePerson(id).then(() => {

        const personsAfterDelete = persons.filter(person => person.id !== id)
        setPersons(personsAfterDelete)

        showNotificationForFiveSeconds({
          content: 'contact deleted correctly',
          type: 'success'
        })
      })
        .catch(() => {
          showNotificationForFiveSeconds({
            content: `${name} was already deleted from the phonebook`,
            type: 'error'
          })

          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const filteredList = persons.filter(person => {
    return person.name.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div>

      <Notification message={notification} />

      <h2>Phonebook</h2>
      <Filter value={query} handleChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm formValues={newPerson} handleChange={handleFormChange} onSubmit={handleSubmit} />

      <h3>Numbers</h3>
      <Persons persons={filteredList} onDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App
