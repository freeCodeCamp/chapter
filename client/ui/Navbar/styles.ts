import css from 'styled-jsx/css';
import { fade } from '@material-ui/core/styles';

import { BREAKPOINTS } from 'client/enums/breakpoints';

export const resolved = css.resolve`
  header {
    width: 100%;
    padding: 16px;
  }

  .nav-toolbar {
    flex-direction: column;
    padding: 0;
  }

  .search-input {
    width: 100%;
    padding: 8px 8px 8px 56px;
  }

  .search-input > :global(input) {
    padding: 0;
    line-height: 1.4;
  }

  .nav-menus {
    justify-content: center;
    margin-bottom: -8px;
  }

  @media (min-width: ${BREAKPOINTS.LG}px) {
    .nav-toolbar {
      flex-direction: row;
      min-height: auto;
    }

    .nav-menus {
      justify-content: flex-end;
      margin-bottom: 0;
    }
  }
`;

export const styles = css`
  .nav-brand {
    width: 100%;
    height: 28px;
    text-align: center;
  }

  .brand {
    max-width: 100%;
    max-height: 100%;
  }

  .search-bar {
    position: relative;
    border-radius: 5px;
    background-color: ${fade('#fff', 0.15)};
    margin: 16px 0 8px;
    width: 100%;
  }

  .search-bar:hover {
    background-color: ${fade('#fff', 0.25)};
  }

  .search-icon-wrapper {
    width: 56px;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    pointer-events: none;
    justify-content: center;
  }

  @media (min-width: ${BREAKPOINTS.LG}px) {
    .nav-brand {
      max-width: 200px;
    }

    .search-bar {
      margin: 0;
    }
  }
`;
