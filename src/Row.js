import _get from 'lodash/get';
import classNames from 'classnames';
import React, { Component } from 'react';

import CustomCell from './CustomCell';

class Row extends Component {
  onMouseDown = (rowIndex, colIndex) => {
    return () => {
      const { setSelection } = this.props;

      if (setSelection) {
        setSelection(rowIndex, colIndex);
      }
    };
  };

  onDoubleClick = (selectedRow, selectedColumn) => {
    return () => {
      const { focus } = this.props;

      if (focus) {
        focus(selectedRow, selectedColumn);
      }
    };
  };

  render() {
    const {
      row,
      style,
      columns,
      rowIndex,
      selection,
      focusedCell,
      focus,
      setSelection,
      onEnter
    } = this.props;

    const { row: focusedRow = null, column: focusedColumn = null } =
      focusedCell || {};
    const { row: selectedRow = null, column: selectedColumn = null } =
      selection || {};

    return (
      <div className="table-row" style={style}>
        {columns.map((column, colIndex) => {
          const { Cell, width, className } = column;

          let rowData = {
            id: row.id,
            index: rowIndex,
            original: row,
            value: _get(row, column.accessor, '')
          };

          const isFocused = rowIndex == focusedRow && colIndex == focusedColumn;
          const isSelected =
            selectedRow == rowIndex && selectedColumn == colIndex;
          let customCell =
            Cell &&
            Cell(rowData, {
              id: row.id,
              onEnter,
              isFocused,
              index: rowIndex
            });

          return (
            <CustomCell
              ref={elem => (this[`cell-${rowIndex}-${colIndex}`] = elem)}
              index={`cell-${rowIndex}-${colIndex}`}
              key={`${rowIndex}-${colIndex}`}
              style={{ width }}
              rowData={rowData}
              isFocused={isFocused}
              isSelected={isSelected}
              customCell={customCell}
              className={classNames('t-columns', className, {
                selected: isSelected
              })}
              onMouseDown={this.onMouseDown(rowIndex, colIndex)}
              onDoubleClick={this.onDoubleClick(selectedRow, selectedColumn)}
            />
          );
        })}
      </div>
    );
  }
}

export default Row;
