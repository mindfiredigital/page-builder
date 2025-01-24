export class TableComponent {
  create(
    rowCount: number,
    columnCount: number,
    isPreview: boolean = false
  ): HTMLElement {
    // Create a container for the table
    const container = document.createElement('div');
    container.classList.add('table-component');

    // Create the table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Generate table rows and cells
    for (let i = 0; i < rowCount; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < columnCount; j++) {
        const cell = document.createElement('td');
        cell.textContent = `Row ${i + 1}, Col ${j + 1}`;
        cell.style.border = '1px solid #000';
        cell.style.padding = '8px';
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    // Add table to container
    container.appendChild(table);

    // Add buttons only if not in preview mode
    if (!isPreview) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container'); // Add a class for styling
      buttonContainer.style.marginTop = '10px';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';

      // Add Row button
      const addRowButton = document.createElement('button');
      addRowButton.textContent = 'Add Row';
      addRowButton.addEventListener('click', () => this.addRow(table));
      buttonContainer.appendChild(addRowButton);

      // Add Column button
      const addColumnButton = document.createElement('button');
      addColumnButton.textContent = 'Add Column';
      addColumnButton.addEventListener('click', () => this.addColumn(table));
      buttonContainer.appendChild(addColumnButton);

      container.appendChild(buttonContainer);
    }

    return container;
  }

  addRow(table: HTMLTableElement): void {
    const rowCount = table.rows.length;
    const columnCount = table.rows[0]?.cells.length || 0;
    const row = document.createElement('tr');

    for (let i = 0; i < columnCount; i++) {
      const cell = document.createElement('td');
      cell.textContent = `Row ${rowCount + 1}, Col ${i + 1}`;
      cell.style.border = '1px solid #000';
      cell.style.padding = '8px';
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  addColumn(table: HTMLTableElement): void {
    const rowCount = table.rows.length;

    for (let i = 0; i < rowCount; i++) {
      const cell = document.createElement('td');
      cell.textContent = `Row ${i + 1}, Col ${table.rows[i].cells.length + 1}`;
      cell.style.border = '1px solid #000';
      cell.style.padding = '8px';
      table.rows[i].appendChild(cell);
    }
  }
}
