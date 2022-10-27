import { Select } from '@chakra-ui/react';

type Base = {
    id: string;
    name: string;
};

type Props<TValue> = {
    label: string;
    selections?: TValue[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const SelectionChooser = <TValue extends Base>({
    label,
    selections,
    onChange,
}: Props<TValue>) => (
    <Select
        bgColor="cupcake.base100"
        outlineColor={'#dbd4d4'}
        color={'cupcake.primarycontent'}
        defaultValue={label}
        id={label}
        name={label}
        variant="outline"
        onChange={(e) => onChange(e)}
        style={{ textAlign: 'center', textTransform: 'capitalize' }}
    >
        {selections?.map((category) => (
            <option
                style={{ backgroundColor: 'white' }}
                color={'cupcake.primarycontent'}
                key={category.id}
                value={category.id}
            >
                {category.name}
            </option>
        ))}
    </Select>
);
