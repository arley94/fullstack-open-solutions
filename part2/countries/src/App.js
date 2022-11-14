import axios from "axios"
import { useEffect, useState } from "react"

const Country = ({ country }) => {

  const { name: { common: name }, capital: [capital], area, languages, flags: { png: flag } } = country

  const [weather, setWeather] = useState({
    temp: 'loading...',
    icon: '',
    wind: 'loading...'
  })

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_KEY}`).then((resp) => {
      const { main: { temp }, wind: { speed: wind }, weather: [{ icon }] } = resp.data;

      setWeather({
        temp,
        icon: `http://openweathermap.org/img/wn/${icon}@2x.png`,
        wind
      })
    })

  }, [capital])


  return (
    <>
      <h2>{name}</h2>
      <p>capital: {capital}</p>
      <p>area: {area}</p>
      <h3>lenguages:</h3>
      <ul>
        {
          Object.values(languages).map((language) => <li key={language}>{language}</li>)
        }
      </ul>
      <div>
        <img src={flag} alt='flag' />
      </div>
      <h2>Wheather in {capital}</h2>
      <div>
        <p>temperature: {weather.temp}</p>
        <img src={weather.icon} alt="" />
        <p>wind: {weather.wind}</p>
      </div>
    </>
  )
}

const ListOfCountry = ({ list, handleShow }) => {

  if (list.length > 10) {
    return (
      <p>to many results, be more specific</p>
    )
  }

  if (list.length === 1) {
    return (
      <Country country={list[0]} />
    )

  }

  return (
    list.map((country) => {
      return (
        <div key={country.name.common}>
          {`${country.name.common} `}
          <button onClick={() => handleShow(country.name.common)}>show</button>
        </div>
      )
    })
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(resp => {
      setCountries(resp.data);
      setChecking(true);
    })
  }, [])

  const handleFilterChange = ({ target }) => {
    setFilter(target.value)
  }

  const handleShow = (countryName) => {
    setFilter(countryName);
  }

  const filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(filter.toLowerCase())
  })

  if (!checking) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <ListOfCountry list={filteredCountries} handleShow={handleShow} />
    </>
  )
}

export default App;

