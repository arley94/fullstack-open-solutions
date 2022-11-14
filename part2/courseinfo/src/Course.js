import React from 'react'
const Header = ({ course }) => {
  return <h1>{course}</h1>
}

const Part = ({ part }) => {
  return (<p>{part.name} {part.exercises}</p>)
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => <Part part={part} key={part.id} />)}
    </div>
  )
}

const Total = ({ parts }) => {

  const total = parts.reduce((total, part) => {
    return total + part.exercises
  }, 0)

  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course