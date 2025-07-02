'use strict';
import React from 'react';
import { useSelector } from 'react-redux';
import TabNav from '../components/TabNav';
import CurrentPane from '../components/CurrentPane';

const App = () => {
  const visiblePane = useSelector(state => state.gui.visiblePane);
  
  return (
    <div>
      <TabNav />
      <CurrentPane visiblePane={visiblePane} />
    </div>
  );
};

export default App;
