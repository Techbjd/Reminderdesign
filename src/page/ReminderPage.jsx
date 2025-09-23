import React from 'react'
import ReminderForm from '../components/ReminderForm'

function ReminderPage() {
  return (
    <div>
       <div className=" mx-auto py-10">  <Link 
        to="/event" className="text-white hover:to-blue-400">see the events that are saved previously</Link></div>
        <ReminderForm />

    </div>
  )
}

export default ReminderPage
