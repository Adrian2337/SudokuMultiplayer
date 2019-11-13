function createSudoku()
{
  for(var a = 0; a < 9; a++)
  {
     var table_row = document.createElement('tr');
     table_row.id = `${a}`;
     for (var b = 0; b < 9; b++)
     {
        var table_data = document.createElement('td');
        table_data.id = `${b}`;
        table_row.appendChild(table_data);
        var sudoku_field = document.createElement('input');
        sudoku_field.type = 'text';
        sudoku_field.pattern = '[1-9]{1}';
        sudoku_field.title = 'One number from 1-9';
        sudoku_field.maxLength = 1;
        sudoku_field.value = sudoku_field.id;
        table_data.appendChild(sudoku_field);
     }
     document.getElementById("sudoku").appendChild(table_row);
  }
}

createSudoku();