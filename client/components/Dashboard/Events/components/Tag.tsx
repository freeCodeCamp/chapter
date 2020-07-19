import React from 'react';
import { makeStyles } from '@material-ui/core';

import { ITagModal } from 'client/store/types/events';

const useStyles = makeStyles({
  tag: {
    borderRadius: '8px',
    padding: '4px 12px',
    backgroundColor: '#22c98c',
    margin: '8px 2px',
    color: '#fff',
    fontWeight: 600,
  },
  tagsContainer: { display: 'flex' },
});

const Tags: React.FC<{ tags?: ITagModal[] }> = ({ tags }) => {
  const style = useStyles();

  return tags ? (
    <div className={style.tagsContainer}>
      {tags.map(tag => (
        <div className={style.tag} key={`tag-${tag.id}`}>
          {tag.name}
        </div>
      ))}
    </div>
  ) : null;
};

export default Tags;
