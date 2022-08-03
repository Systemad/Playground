import React from 'react';

import { AppLayout } from '../components/AppLayout';
import { LobbyLayout } from '../features/lobby/components'
import { Sidebar } from '../components/layouts/Sidebar'

export const Lobby = () => {
  return(
    <AppLayout>
      <Sidebar/>
      <LobbyLayout/>
    </AppLayout>
  );
};