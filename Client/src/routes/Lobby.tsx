import React from 'react';

import { AppLayout } from '../components/AppLayout';
import { Sidebar } from '../components/layouts/Sidebar'
import { LobbyLayout } from '../features/lobby/components'

export const Lobby = () => {
  return(
    <AppLayout>
      <Sidebar/>
      <LobbyLayout/>
    </AppLayout>
  );
};