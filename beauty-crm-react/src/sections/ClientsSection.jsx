import {ClientCard} from "../components/ClientCard.jsx";

export function ClientsSection({
                                 filteredClients,
                                 handleDeleteClient,
                                 setSearchTerm,
                                 openClientEditModal,
                                 openClientAddModal,
                               }) {

  return (
    <>

      <button
        className="clients-section__add-button"
        onClick={openClientAddModal}
      >Добавить клиента
      </button>

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

      <div>

        {
          filteredClients.length === 0
            ? <p>Клиентов нет</p>
            : filteredClients.map(client => (
              <ClientCard
                onDelete={() => handleDeleteClient(client.id)}
                onEdit={() => openClientEditModal(client)}
                key={client.id}
                {...client}
              />
            ))
        }

      </div>

    </>
  )
}