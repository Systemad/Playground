import { Select } from "@chakra-ui/react";
import React from 'react';

import { DifficultyLevel } from '../layouts/CreateQuizLayout';

type Props = {
  label: string,
  difficulties: DifficultyLevel[],
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}

export const DifficultyChooser = ({ label, difficulties, onChange }: Props) => (
  <Select
    defaultValue={label}
    id={label}
    name={label}
    variant='outline'
    color="gray.50"
    onChange={(e) => onChange(e)}
    style={{ textAlign: "center", textTransform: "capitalize" }}
  >
    {difficulties.map((diff) => (
      <option key={diff.id} value={diff.id}>
        {diff.name}
      </option>
    ))}
  </Select>
);