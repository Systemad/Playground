import React from 'react';

import { AppLayout } from '../components/AppLayout';
import { Sidebar } from '../components/layouts/Sidebar';

export const Home = () => {

  return(
    <AppLayout>
      <Sidebar/>
    </AppLayout>
  );
};