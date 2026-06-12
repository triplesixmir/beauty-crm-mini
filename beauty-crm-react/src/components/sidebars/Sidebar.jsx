import chevronRight from "../../assets/general-icons/chevron-right.svg"
import closeIcon from "../../assets/general-icons/close-icon.svg"

export function Sidebar({
                          children,
                          closeSidebarTab,
                          closeSidebarCompletely,
                          openSidebarTab,
                          activeTab,
                          setActiveSidebarTab,
                          sidebarTabs,
                        }) {
  return (
    <div className="sidebar">

      <div className="sidebar__header">
        <div className="sidebar__tabs">
          {sidebarTabs.map(tab => (
            <div
              key={tab.key}
              className={`sidebar__tab ${activeTab === tab.key ? 'sidebar__tab--active' : ''}`}
            >
              <button
                onClick={() => setActiveSidebarTab(tab.key)}
                className="sidebar__tab__title"
              >
                {tab.title}
              </button>
              <button
                onClick={() => closeSidebarTab(tab.key)}
                className="sidebar__tab__close-btn"
              >
                <img
                  src={closeIcon}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}
        </div>

        <button
          className="sidebar__collapse-btn"
          onClick={closeSidebarCompletely}
        >
          <img
            src={chevronRight}
            alt="Свернуть панель"
          />
        </button>
      </div>

      <div className="sidebar__body">
        {children}
      </div>

    </div>
  )
}