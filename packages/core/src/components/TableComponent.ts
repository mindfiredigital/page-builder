export class TableComponent {
  private table: HTMLTableElement;
  private container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('table-component');
    this.table = document.createElement('table');
    this.table.classList.add('custom-table');
    this.addStyles();
    // Initialize the table modal
    this.openTableModal();
  }

  private openTableModal(): void {
    const modal = document.createElement('div');
    modal.classList.add('table-modal');

    const rowInput = document.createElement('input');
    rowInput.type = 'number';
    rowInput.placeholder = 'Enter No. of Rows';
    rowInput.min = '1';
    rowInput.style.marginRight = '2px';
    rowInput.style.padding = '5px';

    const colInput = document.createElement('input');
    colInput.type = 'number';
    colInput.placeholder = 'Enter No. of Columns';
    colInput.min = '1';
    colInput.style.padding = '5px';

    const insertButton = document.createElement('button');
    insertButton.innerText = 'Insert Table';
    insertButton.onclick = () => {
      const rows = parseInt(rowInput.value) || 1;
      const cols = parseInt(colInput.value) || 1;

      if (rows <= 0 || cols <= 0) {
        alert('Please enter valid positive numbers for rows and columns.');
        return;
      }

      this.createTable(rows, cols);
      document.body.removeChild(modal);
    };

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.classList.add('close-button');
    closeButton.onclick = () => document.body.removeChild(modal);

    modal.appendChild(rowInput);
    modal.appendChild(colInput);
    modal.appendChild(insertButton);
    modal.appendChild(closeButton);

    modal.style.position = 'fixed';
    modal.style.top = '10%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.padding = '10px';
    modal.style.backgroundColor = 'white';
    modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';

    document.body.appendChild(modal);
  }

  private createTable(rows: number, columns: number): void {
    for (let i = 0; i < rows; i++) {
      const row = this.table.insertRow();
      for (let j = 0; j < columns; j++) {
        const cell = row.insertCell();
        cell.textContent = `R${i + 1}C${j + 1}`;
        cell.contentEditable = 'true'; // Make cells editable
        cell.classList.add('table-cell');
      }
    }

    this.container.appendChild(this.table);
    this.addTableControls();
  }

  private addTableControls(): void {
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('table-controls');

    const addRowButton = document.createElement('button');
    addRowButton.textContent = 'Add Row';
    addRowButton.addEventListener('click', () => this.addRow());

    const addColumnButton = document.createElement('button');
    addColumnButton.textContent = 'Add Column';
    addColumnButton.addEventListener('click', () => this.addColumn());

    controlsContainer.appendChild(addRowButton);
    controlsContainer.appendChild(addColumnButton);

    this.container.appendChild(controlsContainer);
  }

  private addRow(): void {
    const row = this.table.insertRow();
    const columnCount = this.table.rows[0]?.cells.length || 0;

    for (let i = 0; i < columnCount; i++) {
      const cell = row.insertCell();
      cell.textContent = `New R${this.table.rows.length}C${i + 1}`;
      cell.contentEditable = 'true';
      cell.classList.add('table-cell');
    }
  }

  private addColumn(): void {
    const rows = this.table.rows;

    for (let i = 0; i < rows.length; i++) {
      const cell = rows[i].insertCell();
      cell.textContent = `New R${i + 1}C${rows[i].cells.length}`;
      cell.contentEditable = 'true';
      cell.classList.add('table-cell');
    }
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
        .custom-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .custom-table th, .custom-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .custom-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .custom-table tr:hover {
            background-color: #f1f1f1;
        }
        .custom-table .table-cell {
            cursor: pointer;
        }
        .table-controls {
            margin: 10px 0;
        }
        .table-controls button {
            margin-right: 10px;
            padding: 5px 10px;
            background-color: #4286f4;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 3px;
        }
        .table-controls button:hover {
            background-color: #306bc3;
        }
        .table-modal {
            position: fixed;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: white;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        `;
    document.head.appendChild(style);
  }

  public create(): HTMLElement {
    return this.container;
  }
}
