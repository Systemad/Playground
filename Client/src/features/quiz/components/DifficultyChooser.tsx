import { Select } from "@chakra-ui/react";
import React from 'react';

import { Difficulty } from '../../enums';
import { DifficultyLevel } from '../layouts/CreateQuizLayout';

type Props = {
  label: string,
  categories: DifficultyLevel[],
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}

export const DifficultyChooser = ({ label, categories, onChange }: Props) => (
  <Select
    defaultValue={label}
    id={label}
    name={label}
    variant='outline'
    color="gray.50"
    onChange={(e) => onChange(e)}
    style={{ textAlign: "center", textTransform: "capitalize" }}
  >
    <option value={label} disabled>
      {label}
    </option>
    {categories.map((category) => (
      <option key={category.id} value={category.id} style={{ color: "#000" }}>
        {category.name}
      </option>
    ))}
  </Select>
);