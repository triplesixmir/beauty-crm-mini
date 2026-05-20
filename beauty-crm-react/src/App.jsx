import {ClientCard} from "./components/ClientCard.jsx";
import {useState, useEffect} from "react";
import {ClientForm} from "./components/ClientForm.jsx";

function App() {
  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem('clients');
    return stored ? JSON.parse(stored) : [];
  })

  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients])

  function handleAddClient(clientData) {
    setClients([...clients, {id: Date.now(), ...clientData}])
  }

  function handleDeleteClient(id) {
    const filteredClients = clients.filter(client => client.id !== id);
    setClients(filteredClients);
  }

  function handleEditClient(client) {
    setEditingClient(client);
  }

  function handleUpdateClient(updatedClient) {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client));
    setEditingClient(null);
  }

  const filteredClients = clients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (

    <>
      <input
        type="text"
        name="search-field"
        id=""
        placeholder={'Введите имя клиента'}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <ClientForm
        onAddClient={handleAddClient}
        onEditing={editingClient}
        onUpdateClient={handleUpdateClient}
      />
      <div>

        {
          filteredClients.length === 0
            ? <p>Клиентов нет</p>
            : filteredClients.map(client => (
              <ClientCard
                onDelete={() => handleDeleteClient(client.id)}
                onEdit={() => handleEditClient(client)}
                key={client.id}
                {...client}
              />
            ))
        }

      </div>
    </>
  )
}

export default App

