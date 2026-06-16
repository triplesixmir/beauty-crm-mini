import {ChevronRight as ChevronRightIcon} from "lucide-react";
import {X as XIcon} from "lucide-react"

export function Sidebar({
                          children,
                          closeSidebarTab,
                          closeSidebarCompletely,
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
                aria-label="Закрыть вкладку"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>

        <button
          className="sidebar__collapse-btn"
          onClick={closeSidebarCompletely}
          aria-label="Свернуть панель"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="sidebar__body">
        {children}
      </div>

    </div>
  )
}
