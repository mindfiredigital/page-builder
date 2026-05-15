import { TableComponent } from '../../components/TableComponent';
import { CreateTableRow, CreateTableCell } from '../../components/TableCore';
import {
  SeedFormulaValues,
  UpdateInputValues,
  UpdateCellContent,
} from '../../components/TableCore';
import {
  EvaluateRowVisibility,
  EvaluateRule,
} from '../../components/TableCore';
import { AddRows } from '../../components/TableCore';
import { AddCellToRow, DeleteCell } from '../../components/TableCore';
import { StyleButton } from '../../components/TableCore';
import { GetDefaultValuesOfInput, Restore } from '../../components/TableCore';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../../canvas/Canvas', () => ({
  Canvas: {
    generateUniqueClass: jest.fn((prefix: string) => `${prefix}-test-id`),
    dispatchDesignChange: jest.fn(),
    historyManager: { captureState: jest.fn() },
    layoutMode: 'absolute',
  },
}));

jest.mock('../../components/ModalManager', () => ({
  ModalComponent: jest.fn().mockImplementation(() => ({})),
}));

import { Canvas } from '../../canvas/Canvas';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeTable(rows = 2, cols = 2, isPreview = false): HTMLElement {
  const tc = new TableComponent();
  return tc.create(rows, cols, isPreview, []);
}

function makeTableWithConfig(
  config: ComponentAttribute[],
  rows = 2,
  cols = 2
): HTMLElement {
  const tc = new TableComponent();
  return tc.create(rows, cols, false, config);
}

// ─────────────────────────────────────────────────────────────────────────────
// TableComponent (public API)
// ─────────────────────────────────────────────────────────────────────────────

describe('TableComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  // ── create() ──────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('should return a div with class "table-component"', () => {
      const el = makeTable();
      expect(el.classList.contains('table-component')).toBe(true);
    });

    it('should contain a .table-wrapper child', () => {
      const el = makeTable();
      expect(el.querySelector('.table-wrapper')).not.toBeNull();
    });

    it('should create the correct number of rows', () => {
      const el = makeTable(3, 2);
      const rows = el.querySelectorAll('.table-row');
      expect(rows.length).toBe(3);
    });

    it('should create the correct number of cells per row', () => {
      const el = makeTable(2, 4);
      const firstRow = el.querySelector('.table-row') as HTMLElement;
      expect(firstRow.querySelectorAll('.table-cell').length).toBe(4);
    });

    it('should render Add Row button when isPreview is false', () => {
      const el = makeTable(2, 2, false);
      expect(el.querySelector('.add-multiple-rows-button')).not.toBeNull();
    });

    it('should NOT render Add Row button when isPreview is true', () => {
      const el = makeTable(2, 2, true);
      expect(el.querySelector('.add-multiple-rows-button')).toBeNull();
    });

    it('should render a row count input when not preview', () => {
      const el = makeTable();
      expect(el.querySelector('.row-count-input')).not.toBeNull();
    });

    it('should store tableAttributeConfig statically', () => {
      const config = [
        { key: 'k', title: 'T', type: 'Constant', value: '1', id: 'i1' },
      ] as any;
      const tc = new TableComponent();
      tc.create(1, 1, false, config);
      expect(TableComponent.tableAttributeConfig).toEqual(config);
    });

    it('Add Row button click should call AddRows', () => {
      const el = makeTable(1, 2, false);
      document.body.appendChild(el);
      const btn = el.querySelector(
        '.add-multiple-rows-button'
      ) as HTMLButtonElement;
      const input = el.querySelector('.row-count-input') as HTMLInputElement;
      input.value = '2';
      const wrapper = el.querySelector('.table-wrapper') as HTMLElement;
      const before = wrapper.querySelectorAll('.table-row').length;
      btn.click();
      const after = wrapper.querySelectorAll('.table-row').length;
      expect(after).toBe(before + 2);
    });
  });

  // ── addRows() ─────────────────────────────────────────────────────────────

  describe('addRows()', () => {
    it('should add the specified number of rows to the wrapper', () => {
      const tc = new TableComponent();
      const el = tc.create(1, 2, false, []);
      const wrapper = el.querySelector('.table-wrapper') as HTMLElement;
      tc.addRows(wrapper, 'test-id', 3);
      expect(wrapper.querySelectorAll('.table-row').length).toBe(4);
    });
  });

  // ── static restore() ──────────────────────────────────────────────────────

  describe('static restore()', () => {
    it('should remove .add-multiple-rows-button container when editable=false', () => {
      const el = makeTable(1, 1, false);
      document.body.appendChild(el);
      TableComponent.tableAttributeConfig = [];
      TableComponent.restore(el, false);
      expect(el.querySelector('.table-btn-container')).toBeNull();
    });

    it('should keep Add Row button when editable=true', () => {
      const el = makeTable(1, 1, false);
      document.body.appendChild(el);
      TableComponent.tableAttributeConfig = [];
      TableComponent.restore(el, true);
      expect(el.querySelector('.add-multiple-rows-button')).not.toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CreateTableRow & CreateTableCell
// ─────────────────────────────────────────────────────────────────────────────

describe('CreateTableRow', () => {
  it('should return a div with class "table-row"', () => {
    const row = CreateTableRow(0, 2, 'tbl1');
    expect(row.classList.contains('table-row')).toBe(true);
  });

  it('should have the correct row id', () => {
    const row = CreateTableRow(1, 2, 'tbl1');
    expect(row.id).toBe('table-row-T-tbl1-R1');
  });

  it('should create the specified number of cells', () => {
    const row = CreateTableRow(0, 3, 'tbl1');
    expect(row.querySelectorAll('.table-cell').length).toBe(3);
  });

  it('should set gridTemplateColumns based on cell count', () => {
    const row = CreateTableRow(0, 3, 'tbl1');
    expect(row.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });
});

describe('CreateTableCell', () => {
  it('should return a div with class "table-cell"', () => {
    const cell = CreateTableCell(0, 0, 'tbl1');
    expect(cell.classList.contains('table-cell')).toBe(true);
  });

  it('should contain a .table-cell-content span', () => {
    const cell = CreateTableCell(0, 0, 'tbl1');
    expect(cell.querySelector('.table-cell-content')).not.toBeNull();
  });

  it('should have correct content element id', () => {
    const cell = CreateTableCell(1, 2, 'tbl1');
    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.id).toBe('table-cell-T-tbl1-R1-C2');
  });

  it('default text content should be RxCy format', () => {
    const cell = CreateTableCell(2, 3, 'tbl1');
    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.textContent).toBe('R2C3');
  });

  it('should have contentEditable set on the content span', () => {
    const cell = CreateTableCell(0, 0, 'tbl1');
    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.contentEditable).toBe('true');
  });

  it('should contain add and delete cell buttons', () => {
    const cell = CreateTableCell(0, 0, 'tbl1');
    expect(cell.querySelector('.add-cell-button')).not.toBeNull();
    expect(cell.querySelector('.delete-cell-button')).not.toBeNull();
  });

  it('add button click should call AddCellToRow (appends a new cell)', () => {
    const row = CreateTableRow(0, 2, 'tbl1');
    document.body.appendChild(row);
    const cell = row.querySelector('.table-cell') as HTMLElement;
    const addBtn = cell.querySelector('.add-cell-button') as HTMLButtonElement;
    addBtn.click();
    expect(row.querySelectorAll('.table-cell').length).toBe(3);
  });

  it('delete button click should remove the cell', () => {
    const row = CreateTableRow(0, 2, 'tbl1');
    document.body.appendChild(row);
    const cells = row.querySelectorAll('.table-cell');
    const deleteBtn = cells[0].querySelector(
      '.delete-cell-button'
    ) as HTMLButtonElement;
    deleteBtn.click();
    expect(row.querySelectorAll('.table-cell').length).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AddCellToRow & DeleteCell
// ─────────────────────────────────────────────────────────────────────────────

describe('AddCellToRow', () => {
  beforeEach(() => (document.body.innerHTML = ''));

  it('should append a new cell to the row', () => {
    const row = CreateTableRow(0, 2, 'tbl1');
    document.body.appendChild(row);
    const cell = row.querySelector('.table-cell') as HTMLElement;
    AddCellToRow(cell, 'tbl1');
    expect(row.querySelectorAll('.table-cell').length).toBe(3);
  });

  it('should update gridTemplateColumns after adding', () => {
    const row = CreateTableRow(0, 2, 'tbl1');
    document.body.appendChild(row);
    const cell = row.querySelector('.table-cell') as HTMLElement;
    AddCellToRow(cell, 'tbl1');
    expect(row.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });

  it('should give the new cell a unique incrementing index', () => {
    const row = CreateTableRow(0, 2, 'tbl1');
    document.body.appendChild(row);
    const cell = row.querySelector('.table-cell') as HTMLElement;
    AddCellToRow(cell, 'tbl1');
    const contents = Array.from(row.querySelectorAll('.table-cell-content'));
    const ids = contents.map(el => el.id);
    // Last added cell should have index 2 (0 and 1 existed)
    expect(ids.some(id => id.endsWith('-C2'))).toBe(true);
  });
});

describe('DeleteCell', () => {
  beforeEach(() => (document.body.innerHTML = ''));

  it('should remove the cell from its row', () => {
    const row = CreateTableRow(0, 3, 'tbl1');
    document.body.appendChild(row);
    const cell = row.querySelector('.table-cell') as HTMLElement;
    DeleteCell(cell);
    expect(row.querySelectorAll('.table-cell').length).toBe(2);
  });

  it('should update gridTemplateColumns after deletion', () => {
    const row = CreateTableRow(0, 3, 'tbl1');
    document.body.appendChild(row);
    const cell = row.querySelector('.table-cell') as HTMLElement;
    DeleteCell(cell);
    expect(row.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
  });

  it('should remove the whole row when deleting the last cell (multiple rows)', () => {
    const wrapper = document.createElement('div');
    const row1 = CreateTableRow(0, 1, 'tbl1');
    const row2 = CreateTableRow(1, 1, 'tbl1');
    wrapper.appendChild(row1);
    wrapper.appendChild(row2);
    document.body.appendChild(wrapper);
    const cell = row1.querySelector('.table-cell') as HTMLElement;
    DeleteCell(cell);
    expect(wrapper.children.length).toBe(1);
  });

  it('should NOT remove row when it is the only row in wrapper', () => {
    const wrapper = document.createElement('div');
    const row = CreateTableRow(0, 1, 'tbl1');
    wrapper.appendChild(row);
    document.body.appendChild(wrapper);
    const cell = row.querySelector('.table-cell') as HTMLElement;
    DeleteCell(cell);
    // Row should still exist but have 0 cells
    expect(wrapper.children.length).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AddRows
// ─────────────────────────────────────────────────────────────────────────────

describe('AddRows', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    (Canvas.historyManager.captureState as jest.Mock).mockClear();
  });

  it('should add the specified number of rows', () => {
    const wrapper = document.createElement('div');
    const existing = CreateTableRow(0, 2, 'tbl1');
    wrapper.appendChild(existing);
    document.body.appendChild(wrapper);
    AddRows(wrapper, 'tbl1', 3);
    expect(wrapper.querySelectorAll('.table-row').length).toBe(4);
  });

  it('should default to 1 row when count not provided', () => {
    const wrapper = document.createElement('div');
    wrapper.appendChild(CreateTableRow(0, 2, 'tbl1'));
    document.body.appendChild(wrapper);
    AddRows(wrapper, 'tbl1');
    expect(wrapper.querySelectorAll('.table-row').length).toBe(2);
  });

  it('new rows should inherit cell count from existing first row', () => {
    const wrapper = document.createElement('div');
    wrapper.appendChild(CreateTableRow(0, 4, 'tbl1'));
    document.body.appendChild(wrapper);
    AddRows(wrapper, 'tbl1', 1);
    const rows = wrapper.querySelectorAll('.table-row');
    const newRow = rows[rows.length - 1];
    expect(newRow.querySelectorAll('.table-cell').length).toBe(4);
  });

  it('should call Canvas.historyManager.captureState', () => {
    const wrapper = document.createElement('div');
    wrapper.appendChild(CreateTableRow(0, 1, 'tbl1'));
    document.body.appendChild(wrapper);
    AddRows(wrapper, 'tbl1', 1);
    expect(Canvas.historyManager.captureState).toHaveBeenCalled();
  });

  it('should default to 1 cell when wrapper is empty', () => {
    const wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    AddRows(wrapper, 'tbl1', 1);
    const row = wrapper.querySelector('.table-row') as HTMLElement;
    expect(row.querySelectorAll('.table-cell').length).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// StyleButton
// ─────────────────────────────────────────────────────────────────────────────

describe('StyleButton', () => {
  it('should apply background color', () => {
    const btn = document.createElement('button');
    StyleButton(btn, '#10b981', '#059669');
    expect(btn.style.backgroundColor).toBe('rgb(16, 185, 129)');
  });

  it('should apply padding, border-radius, font size', () => {
    const btn = document.createElement('button');
    StyleButton(btn, '#10b981', '#059669');
    expect(btn.style.padding).toBe('8px 16px');
    expect(btn.style.borderRadius).toBe('6px');
    expect(btn.style.fontSize).toBe('14px');
  });

  it('should change background on mouseenter', () => {
    const btn = document.createElement('button');
    StyleButton(btn, '#10b981', '#059669');
    btn.dispatchEvent(new MouseEvent('mouseenter'));
    expect(btn.style.backgroundColor).toBe('rgb(5, 150, 105)');
  });

  it('should restore background on mouseleave', () => {
    const btn = document.createElement('button');
    StyleButton(btn, '#10b981', '#059669');
    btn.dispatchEvent(new MouseEvent('mouseenter'));
    btn.dispatchEvent(new MouseEvent('mouseleave'));
    expect(btn.style.backgroundColor).toBe('rgb(16, 185, 129)');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SeedFormulaValues
// ─────────────────────────────────────────────────────────────────────────────

describe('SeedFormulaValues', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    (Canvas.dispatchDesignChange as jest.Mock).mockClear();
  });

  it('should update cell text for a matching key', () => {
    const table = document.createElement('div');
    table.classList.add('table-component');
    const cell = document.createElement('div');
    cell.setAttribute('data-attribute-key', 'price');
    const content = document.createElement('span');
    content.classList.add('table-cell-content');
    content.textContent = 'old';
    cell.appendChild(content);
    table.appendChild(cell);
    document.body.appendChild(table);

    SeedFormulaValues({ price: 42 });
    expect(content.textContent).toBe('42');
  });

  it('should set color to black on matched cells', () => {
    const table = document.createElement('div');
    table.classList.add('table-component');
    const cell = document.createElement('div');
    cell.setAttribute('data-attribute-key', 'total');
    const content = document.createElement('span');
    content.classList.add('table-cell-content');
    cell.appendChild(content);
    table.appendChild(cell);
    document.body.appendChild(table);

    SeedFormulaValues({ total: 100 });
    expect((cell as HTMLElement).style.color).toBe('rgb(0, 0, 0)');
  });

  it('should call Canvas.dispatchDesignChange', () => {
    SeedFormulaValues({});
    expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// UpdateInputValues
// ─────────────────────────────────────────────────────────────────────────────

describe('UpdateInputValues', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    (Canvas.dispatchDesignChange as jest.Mock).mockClear();
  });

  it('should update text for Input-type matching cells', () => {
    const table = document.createElement('div');
    table.classList.add('table-component');
    const cell = document.createElement('div');
    cell.setAttribute('data-attribute-key', 'qty');
    cell.setAttribute('data-attribute-type', 'Input');
    const content = document.createElement('span');
    content.classList.add('table-cell-content');
    content.textContent = 'old';
    cell.appendChild(content);
    table.appendChild(cell);
    document.body.appendChild(table);

    UpdateInputValues({ qty: '10' });
    expect(content.textContent).toBe('10');
  });

  it('should NOT update Formula-type cells', () => {
    const table = document.createElement('div');
    table.classList.add('table-component');
    const cell = document.createElement('div');
    cell.setAttribute('data-attribute-key', 'total');
    cell.setAttribute('data-attribute-type', 'Formula');
    const content = document.createElement('span');
    content.classList.add('table-cell-content');
    content.textContent = 'original';
    cell.appendChild(content);
    table.appendChild(cell);
    document.body.appendChild(table);

    UpdateInputValues({ total: 'changed' });
    expect(content.textContent).toBe('original');
  });

  it('should call Canvas.dispatchDesignChange', () => {
    UpdateInputValues({});
    expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// UpdateCellContent
// ─────────────────────────────────────────────────────────────────────────────

describe('UpdateCellContent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    (Canvas.dispatchDesignChange as jest.Mock).mockClear();
  });

  function makeCell(): HTMLElement {
    const cell = CreateTableCell(0, 0, 'tbl1');
    document.body.appendChild(cell);
    return cell;
  }

  it('should set data-attribute-key and data-attribute-type', () => {
    const cell = makeCell();
    UpdateCellContent(cell, {
      key: 'price',
      type: 'Constant',
      value: '99',
      title: 'Price',
      id: 'i1',
    } as any);
    expect(cell.getAttribute('data-attribute-key')).toBe('price');
    expect(cell.getAttribute('data-attribute-type')).toBe('Constant');
  });

  it('should set content to value for Constant type', () => {
    const cell = makeCell();
    UpdateCellContent(cell, {
      key: 'k',
      type: 'Constant',
      value: '55',
      title: 'T',
      id: 'i1',
    } as any);
    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.textContent).toBe('55');
  });

  it('should set content to title for Formula type and grey style', () => {
    const cell = makeCell();
    UpdateCellContent(cell, {
      key: 'f',
      type: 'Formula',
      value: '',
      title: 'MyFormula',
      id: 'i1',
    } as any);
    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.textContent).toBe('MyFormula');
    expect(cell.style.color).toBe('rgb(188, 191, 198)');
  });

  it('should set content to value for Input type', () => {
    const cell = makeCell();
    UpdateCellContent(cell, {
      key: 'n',
      type: 'Input',
      value: 'InputVal',
      title: 'T',
      id: 'i1',
    } as any);
    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.textContent).toBe('InputVal');
  });

  it('should call Canvas.dispatchDesignChange', () => {
    const cell = makeCell();
    UpdateCellContent(cell, {
      key: 'k',
      type: 'Constant',
      value: 'v',
      title: 'T',
      id: 'i1',
    } as any);
    expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// EvaluateRule
// ─────────────────────────────────────────────────────────────────────────────

describe('EvaluateRule', () => {
  it('equals — should return true for matching values', () => {
    expect(EvaluateRule('hello', 'equals', 'hello')).toBe(true);
  });

  it('equals — should be case-insensitive', () => {
    expect(EvaluateRule('Hello', 'equals', 'hello')).toBe(true);
  });

  it('equals — should return false for non-matching', () => {
    expect(EvaluateRule('hello', 'equals', 'world')).toBe(false);
  });

  it('not_equals — should return true when values differ', () => {
    expect(EvaluateRule('a', 'not_equals', 'b')).toBe(true);
  });

  it('not_equals — should return false when values match', () => {
    expect(EvaluateRule('a', 'not_equals', 'a')).toBe(false);
  });

  it('greater_than — should return true when input > rule', () => {
    expect(EvaluateRule('10', 'greater_than', '5')).toBe(true);
  });

  it('greater_than — should return false when input < rule', () => {
    expect(EvaluateRule('3', 'greater_than', '5')).toBe(false);
  });

  it('greater_than — should return false for non-numeric', () => {
    expect(EvaluateRule('abc', 'greater_than', '5')).toBe(false);
  });

  it('less_than — should return true when input < rule', () => {
    expect(EvaluateRule('3', 'less_than', '10')).toBe(true);
  });

  it('less_than — should return false when input > rule', () => {
    expect(EvaluateRule('15', 'less_than', '10')).toBe(false);
  });

  it('contains — should return true when input contains rule', () => {
    expect(EvaluateRule('hello world', 'contains', 'world')).toBe(true);
  });

  it('contains — should be case-insensitive', () => {
    expect(EvaluateRule('Hello World', 'contains', 'world')).toBe(true);
  });

  it('contains — should return false when not contained', () => {
    expect(EvaluateRule('hello', 'contains', 'xyz')).toBe(false);
  });

  it('unknown operator — should return false', () => {
    expect(EvaluateRule('5', 'between', '3')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// EvaluateRowVisibility
// ─────────────────────────────────────────────────────────────────────────────

describe('EvaluateRowVisibility', () => {
  beforeEach(() => (document.body.innerHTML = ''));

  function makeRow(rules?: object[]): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('table-component');
    const row = document.createElement('div');
    row.classList.add('table-row');
    if (rules) row.setAttribute('data-visibility-rules', JSON.stringify(rules));
    wrapper.appendChild(row);
    document.body.appendChild(wrapper);
    return row;
  }

  it('should show rows with no rules', () => {
    const row = makeRow();
    EvaluateRowVisibility({});
    expect((row as HTMLElement).style.display).toBe('grid');
  });

  it('should show rows with empty rules array', () => {
    const row = makeRow([]);
    EvaluateRowVisibility({});
    expect((row as HTMLElement).style.display).toBe('grid');
  });

  it('should hide row when hide rule condition is met', () => {
    const row = makeRow([
      { inputKey: 'status', operator: 'equals', value: 'hide', action: 'hide' },
    ]);
    EvaluateRowVisibility({ status: 'hide' });
    expect((row as HTMLElement).style.display).toBe('none');
  });

  it('should show row when show rule condition is met', () => {
    const row = makeRow([
      {
        inputKey: 'status',
        operator: 'equals',
        value: 'active',
        action: 'show',
      },
    ]);
    EvaluateRowVisibility({ status: 'active' });
    expect((row as HTMLElement).style.display).toBe('grid');
  });

  it('should hide row when show condition is NOT met', () => {
    const row = makeRow([
      {
        inputKey: 'status',
        operator: 'equals',
        value: 'active',
        action: 'show',
      },
    ]);
    EvaluateRowVisibility({ status: 'inactive' });
    expect((row as HTMLElement).style.display).toBe('none');
  });

  it('should scope to provided table element', () => {
    const table1 = document.createElement('div');
    table1.classList.add('table-component');
    const row1 = document.createElement('div');
    row1.classList.add('table-row');
    row1.setAttribute(
      'data-visibility-rules',
      JSON.stringify([
        { inputKey: 'x', operator: 'equals', value: '1', action: 'hide' },
      ])
    );
    table1.appendChild(row1);

    const table2 = document.createElement('div');
    table2.classList.add('table-component');
    const row2 = document.createElement('div');
    row2.classList.add('table-row');
    row2.setAttribute(
      'data-visibility-rules',
      JSON.stringify([
        { inputKey: 'x', operator: 'equals', value: '1', action: 'hide' },
      ])
    );
    table2.appendChild(row2);

    document.body.appendChild(table1);
    document.body.appendChild(table2);

    EvaluateRowVisibility({ x: '1' }, table1);

    // Only table1's row should be affected
    expect(row1.style.display).toBe('none');
    // table2's row was not evaluated (no style set by this call)
    expect(row2.style.display).not.toBe('none');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GetDefaultValuesOfInput
// ─────────────────────────────────────────────────────────────────────────────

describe('GetDefaultValuesOfInput', () => {
  it('should return defaults for Input-typed attributes with default_value', () => {
    const config = [
      {
        key: 'qty',
        type: 'Input',
        default_value: '5',
        title: 'Qty',
        id: 'i1',
        value: '',
      },
      {
        key: 'name',
        type: 'Input',
        default_value: 'John',
        title: 'Name',
        id: 'i2',
        value: '',
      },
    ] as any;
    const result = GetDefaultValuesOfInput(config);
    expect(result).toEqual({ qty: '5', name: 'John' });
  });

  it('should skip non-Input typed attributes', () => {
    const config = [
      {
        key: 'price',
        type: 'Formula',
        default_value: '100',
        title: 'P',
        id: 'i1',
        value: '',
      },
    ] as any;
    const result = GetDefaultValuesOfInput(config);
    expect(result).toEqual({});
  });

  it('should skip Input attributes with undefined default_value', () => {
    const config = [
      { key: 'qty', type: 'Input', title: 'Qty', id: 'i1', value: '' },
    ] as any;
    const result = GetDefaultValuesOfInput(config);
    expect(result).toEqual({});
  });

  it('should return empty object for empty config', () => {
    expect(GetDefaultValuesOfInput([])).toEqual({});
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Restore (TableRestore)
// ─────────────────────────────────────────────────────────────────────────────

describe('Restore', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    (Canvas.historyManager.captureState as jest.Mock).mockClear();
  });

  function buildTable(rows = 1, cols = 2, withButtons = true): HTMLElement {
    const tc = new TableComponent();
    const el = tc.create(rows, cols, !withButtons, []);
    document.body.appendChild(el);
    return el;
  }

  it('should log error if no table-wrapper found', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const empty = document.createElement('div');
    document.body.appendChild(empty);
    Restore(empty, true, []);
    expect(consoleSpy).toHaveBeenCalledWith(
      'No table wrapper found in container'
    );
  });

  it('should remove .selected class from rows', () => {
    const el = buildTable();
    const row = el.querySelector('.table-row') as HTMLElement;
    row.classList.add('selected');
    Restore(el, true, []);
    expect(row.classList.contains('selected')).toBe(false);
  });

  it('should remove cell-controls when editable=false', () => {
    const el = buildTable();
    Restore(el, false, []);
    expect(el.querySelector('.cell-controls')).toBeNull();
  });

  it('should remove contenteditable from cells when editable=false', () => {
    const el = buildTable();
    Restore(el, false, []);
    const content = el.querySelector('.table-cell-content') as HTMLElement;
    expect(content.getAttribute('contenteditable')).toBeNull();
  });

  it('should remove btn-container when editable=false', () => {
    const el = buildTable(1, 1, true);
    Restore(el, false, []);
    expect(el.querySelector('.table-btn-container')).toBeNull();
  });

  it('should restore formula cell text from config default_value', () => {
    const el = buildTable();
    // Set attribute key on first cell
    const cell = el.querySelector('.table-cell') as HTMLElement;
    cell.setAttribute('data-attribute-key', 'total');
    cell.setAttribute('data-attribute-type', 'Formula');

    const config = [
      {
        key: 'total',
        title: 'Total',
        type: 'Formula',
        default_value: '999',
        id: 'i1',
        value: '',
      },
    ] as any;
    Restore(el, true, config);

    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.textContent).toBe('999');
  });

  it('should style formula placeholder if no default_value', () => {
    const el = buildTable();
    const cell = el.querySelector('.table-cell') as HTMLElement;
    cell.setAttribute('data-attribute-key', 'total');
    cell.setAttribute('data-attribute-type', 'Formula');

    const config = [
      {
        key: 'total',
        title: 'TotalTitle',
        type: 'Formula',
        id: 'i1',
        value: '',
      },
    ] as any;
    Restore(el, true, config);

    const content = cell.querySelector('.table-cell-content') as HTMLElement;
    expect(content.textContent).toBe('TotalTitle');
    expect(cell.style.color).toBe('rgb(188, 191, 198)');
  });
});
