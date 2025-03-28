import React from 'react'

const Tab = ({ tab, setTab, tabStatus, tabName }) => {
  return (
    <h4
      onClick={() => setTab(tabStatus)}
      className={`${tab === tabStatus ? 'underline' : ''} cursor-pointer`}
    >
      {tabName}
    </h4>
  )
};

export default Tab;