import React from 'react';

import { AppLayout } from '../../../components/AppLayout';
import { Sidebar } from '../../../components/layouts/Sidebar'
import { CreateQuizLayout } from '../index';

export const CreateQuiz = () => {
  return(
    <AppLayout>
      <Sidebar/>
      <CreateQuizLayout/>
    </AppLayout>
  );
};