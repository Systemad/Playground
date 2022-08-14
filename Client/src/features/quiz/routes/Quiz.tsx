import React from 'react';

import { AppLayout } from '../../../components/AppLayout';
import { Sidebar } from '../../../components/layouts/Sidebar'
import { QuizLayout } from '../index';

export const Quiz = () => {
  return(
    <AppLayout>
      <Sidebar/>
      <QuizLayout/>
    </AppLayout>
  );
};