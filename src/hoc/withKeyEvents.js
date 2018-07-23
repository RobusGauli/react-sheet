import React, { Component } from 'react';

import * as keys from '../constants/keys';

const ALLOWED_KEYS = [keys.UP, keys.LEFT, keys.DOWN, keys.RIGHT, keys.ENTER];

function withKeyEvents(WrappedComponent) {
  return class KeyWrapper extends Component {
    constructor() {
      super();
      this.state = {
        selection: {
          row: 1,
          column: 1
        },
        focusedCell: {
          row: 0,
          column: 0
        }
      };
    }

    componentDidMount() {
      this.addListeners();
    }

    componentWillUnmount() {
      this.removeListeners();
    }

    addListeners = () => {
      window.addEventListener('keydown', this.onKeyDown, false);
      window.addEventListener('keypress', this.onKeyPress, false);
    };

    addEscapeListener = () => {
      window.addEventListener('keydown', this.onEscapeKeyDown, false);
    };

    removeEscapeListener = () => {
      window.removeEventListener('keydown', this.onEscapeKeyDown, false);
    };

    removeListeners = () => {
      window.removeEventListener('keydown', this.onKeyDown, false);
    };

    /**
     * Focus while directly typing on selection.
     */
    onKeyPress = e => {
      if (!this.isFocused()) {
        this.focus();
      }
    };

    onEscapeKeyDown = e => {
      const keyCode = e.keyCode;

      if (keyCode === keys.ESCAPE) {
        e.preventDefault();

        this.addListeners();
        this.removeEscapeListener();
      }
      if (keyCode === keys.ENTER) {
        e.preventDefault();

        this.moveDown();
        this.addListeners();
        this.removeEscapeListener();
      }
    };

    scrollToCell = (row, column) => {
      const cell = document.querySelector(`#cell-${row}-${column}`);

      cell.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'nearest'
      });
    };

    setSelection = (row, column) => {
      this.scrollToCell(row, column);

      this.setState({
        focusedCell: {
          row: null,
          column: null
        },
        selection: {
          row,
          column
        }
      });
    };

    isFocused = () => {
      const { row, column } = this.state.focusedCell;

      if (row && column) {
        return true;
      }

      return false;
    };

    setFocus = (row, column) => {
      this.setState({
        focusedCell: {
          row,
          column
        }
      });
    };

    onKeyDown = e => {
      const keyCode = e.keyCode;

      if (!ALLOWED_KEYS.includes(keyCode)) {
        return;
      }

      e.preventDefault();

      let press = {
        [keys.UP]: this.moveUp,
        [keys.DOWN]: this.moveDown,
        [keys.LEFT]: this.moveLeft,
        [keys.RIGHT]: this.moveRight,
        [keys.ENTER]: this.focus
      };

      press[keyCode]();
    };

    moveUp = () => {
      let { selection } = this.state;

      let row = selection.row && selection.row - 1;
      let column = selection.column;

      this.setSelection(row, column);
    };

    moveDown = () => {
      let { selection } = this.state;
      let { data } = this.props;

      let row =
        selection.row < data.length - 1 ? selection.row + 1 : selection.row;
      let column = selection.column;

      this.setSelection(row, column);
    };

    moveLeft = () => {
      let { selection } = this.state;
      let row = selection.row;
      let column = selection.column && selection.column - 1;

      this.setSelection(row, column);
    };

    moveRight = () => {
      let { selection } = this.state;
      let { columns } = this.props;

      let row = selection.row;
      let column =
        selection.column < columns.length - 1
          ? selection.column + 1
          : selection.column;

      this.setSelection(row, column);
    };

    focus = () => {
      let { selection } = this.state;

      this.removeListeners();
      this.addEscapeListener();
      this.setFocus(selection.row, selection.column);
    };

    render() {
      const { selection, focusedCell } = this.state;

      return (
        <WrappedComponent
          ref={elem => {
            this.keyWrapper = elem;
          }}
          selection={selection}
          focusedCell={focusedCell}
          setSelection={this.setSelection}
          {...this.props}
        />
      );
    }
  };
}

export default withKeyEvents;
