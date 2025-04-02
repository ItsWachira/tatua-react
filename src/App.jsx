import { useState } from 'react'
import Header from './components/Header'
import PeopleDataView from './components/PeopleDataView'
import TicketForm from './components/TicketForm'
import TicketsList from './components/TicketsList'
import './styles/main.css'

function App() {
  const [activeView, setActiveView] = useState('peopleData')

  return (
    <div className="container">
      <Header activeView={activeView} setActiveView={setActiveView} />
      
      <div className="content">
        {activeView === 'peopleData' && <PeopleDataView />}
        {activeView === 'raiseTicket' && <TicketForm />}
        {activeView === 'ticketsList' && <TicketsList />}
      </div>
    </div>
  )
}

export default App
