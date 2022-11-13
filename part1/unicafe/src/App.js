import { useState } from 'react'


const StatisticLine = ({ text, value }) => {

  if (text === 'positive') {
    return <tr><td>{text}</td><td>{value} %</td></tr>
  }
  return (
    <tr><td>{text}</td><td>{value}</td></tr>
  )
}


const Statistics = ({ good, neutral, bad, show }) => {

  const total = good + neutral + bad;
  const average = total === 0 ? 0 : ((good * 1) + (bad * -1)) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  return (
    <>
      <h2>Statistics</h2>
      {
        show
          ? (
            <table>
              <tbody>
                <StatisticLine text={'good'} value={good} />
                <StatisticLine text={'neutral'} value={neutral} />
                <StatisticLine text={'bad'} value={bad} />
                <StatisticLine text={'all'} value={total} />
                <StatisticLine text={'average'} value={average} />
                <StatisticLine text={'positive'} value={positive} />
              </tbody>
            </table>

          )
          : <p>No feedback given</p>
      }

    </>
  )
}

const Button = ({ handleClick, label }) => {
  return <button onClick={handleClick}>{label}</button>
}

const App = () => {

  const [showStatistics, setShowStatistics] = useState(false)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleFeedback = (callback) => {
    setShowStatistics(true)
    callback(state => state + 1)
  }


  return (
    <div>
      <h2>Give feedback</h2>
      <div>
        <Button handleClick={() => { handleFeedback(setGood) }} label={"good"} />
        <Button handleClick={() => { handleFeedback(setNeutral) }} label={"neutral"} />
        <Button handleClick={() => { handleFeedback(setBad) }} label={"bad"} />
      </div>

      <Statistics good={good} bad={bad} neutral={neutral} show={showStatistics} />
    </div>
  )
}

export default App
