import { Select } from '@chakra-ui/react';
import React from 'react';

type Props = {
  label: string,
  selections: any[],
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}

export const SelectionChooser = ({ label, selections, onChange }: Props) => (
  <Select
    defaultValue={label}
    id={label}
    name={label}
    variant='outline'
    onChange={(e) => onChange(e)}
    style={{ textAlign: 'center', textTransform: 'capitalize' }}
  >
    {selections?.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </Select>
);