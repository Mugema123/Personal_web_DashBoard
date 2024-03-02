import React from 'react';
// @mui
import { List } from '@mui/material';
import CategoryTile from './CategoryTile';

const CategoriesList = ({
  categories,
  onEdit,
  onDelete,
  disabled,
}) => {
  return (
    <List>
      {categories.map((item, index) => {
        const category = {
          id: item._id,
          name: item.name,
        };
        const isDisabled = disabled === category.id;

        return (
          <CategoryTile
            onEdit={id => onEdit(id)}
            onDelete={id => onDelete(id)}
            category={category}
            isDisabled={isDisabled}
            key={index}
          />
        );
      })}
    </List>
  );
};

export default CategoriesList;
