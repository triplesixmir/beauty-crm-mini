import {useState, useEffect} from "react";

export function useClients() {
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

  function handleResetEditingClient() {
    setEditingClient(null);
  }

  const filteredClients = clients.filter(client => String(client.name).toLowerCase().includes(searchTerm.toLowerCase()));

  return {
    clients,
    editingClient,
    filteredClients,
    handleAddClient,
    handleDeleteClient,
    handleEditClient,
    handleUpdateClient,
    handleResetEditingClient,
    setSearchTerm
  };
}
