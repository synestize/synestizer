import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setVisiblePane } from '../features/gui/guiSlice';
import Link from './Link';

// This is the new, hook-based component that was previously a container.
const SelectTabLink = ({ paneId, children }) => {
  const dispatch = useDispatch();
  // Use `useSelector` to get data from the Redux store.
  const active = useSelector((state) => state.gui.visiblePane === paneId);

  const handleClick = () => {
    // Use `useDispatch` to dispatch actions.
    dispatch(setVisiblePane(paneId));
  };

  return (
    <Link active={active} onClick={handleClick}>
      {children}
    </Link>
  );
};

// The TabNav component now uses the new hook-based SelectTabLink.
const TabNav = () => {
  return (<nav className="tabnav"><ul className="tabs">
    <li>
      <SelectTabLink paneId="welcome" >
        About
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="io" >
        Settings
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="sound">
        Sound
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="performance">
        Performance
      </SelectTabLink>
    </li>
  </ul></nav>)
}
export default TabNav;
