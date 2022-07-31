import React from 'react';

import { AppLayout } from '../components/AppLayout';
import { LobbyLayout } from '../components/layouts/Lobby'
import { Sidebar } from '../components/layouts/Sidebar'

export const Lobby = () => {
  return(
    <AppLayout>
      <Sidebar/>
      <LobbyLayout/>
    </AppLayout>
  );
};