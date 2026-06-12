import {useState} from "react";

export function useSidebars() {

  const [sidebarTabs, setSidebarTabs] = useState([]);
  const [activeSidebarTabKey, setActiveSidebarTabKey] = useState(null);

  function openSidebarTab(config) {

    setSidebarTabs(prevTabs => {
      const tabAlreadyExists = prevTabs.some(tab => tab.key === config.key)

      if (tabAlreadyExists) {
        return prevTabs;
      }

      return [...prevTabs, config];

    });

    setActiveSidebarTabKey(config.key);

  }

  function closeSidebarTab(key) {
    const closedTabIndex = sidebarTabs.findIndex(tab => tab.key === key);

    setSidebarTabs(prevTabs => prevTabs.filter(tab => tab.key !== key));
    if (activeSidebarTabKey === key) {
      setActiveSidebarTabKey(closedTabIndex > 0 ? sidebarTabs[closedTabIndex - 1]?.key : sidebarTabs[closedTabIndex + 1]?.key || null);
    }
  }

  function setActiveSidebarTab(key) {
    setActiveSidebarTabKey(key);
  }

  function closeSidebarCompletely() {
    setSidebarTabs([]);
    setActiveSidebarTabKey(null);
  }

  return {
    sidebarTabs,
    activeSidebarTabKey,
    openSidebarTab,
    closeSidebarTab,
    setActiveSidebarTab,
    closeSidebarCompletely
  }
}