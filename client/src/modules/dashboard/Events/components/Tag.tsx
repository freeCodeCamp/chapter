import React from 'react';
import { Tag } from '../../../../generated';

import Chip from '@material-ui/core/Chip';

const Tags: React.FC<{ tags?: Pick<Tag, 'name' | 'id'>[] }> = ({ tags }) => {
  return tags ? (
    <>
      {tags.map(tag => (
        <Chip key={`tag-${tag.id}`} label={tag.name} size="small" />
      ))}
    </>
  ) : null;
};

export default Tags;
