import {ClientCard} from "../components/ClientCard.jsx";
import {ClientForm} from "../components/ClientForm.jsx";

export function ClientsSection({
                                 editingClient,
                                 filteredClients,
                                 handleAddClient,
                                 handleDeleteClient,
                                 handleEditClient,
                                 handleUpdateClient,
                                 handleCancelEditClient,
                                 setSearchTerm,
                               }) {

  return (
    <>

      <label>
        Поиск по клиентам
        <input
          type="text"
          name="search-field"
          id=""
          placeholder={'Поиск...'}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </label>
      <ClientForm
        key={editingClient?.id ?? 'new-client'}
        onAddClient={handleAddClient}
        onEditing={editingClient}
        onUpdateClient={handleUpdateClient}
        onCancelEdit={handleCancelEditClient}
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