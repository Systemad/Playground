import { Select } from "@chakra-ui/react";
import React from 'react';

import { TriviaCategory } from '../api/CategoryAPI';

type Props = {
  label: string,
  categories: TriviaCategory[],
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}

export const CategoryChooser = ({ label, categories, onChange }: Props) => (
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
    {categories?.map((category) => (
      <option key={category.id} value={category.id} style={{ color: "#000" }}>
        {category.name}
      </option>
    ))}
  </Select>
);