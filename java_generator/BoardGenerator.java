import java.util.Arrays;

public class BoardGenerator 
{
    String jsonBoard;
    int[][] fullboard;
    int [][] board;
    
    public String toJson(int[][] array, int[][] array_2)
    {
      String json = new String();
      json += "'{\"solver\": ";
      json += Arrays.deepToString(array);
      json += ", \"start_sudoku\": ";
      json += Arrays.deepToString(array_2);
      json += "}'";
      return json;
    }


    public BoardGenerator(int visibleFields)
    {
        int size=9;
        fullboard=BoardMaker.createBoard(size);
        board=BoardMaker.boardHider(81-visibleFields, fullboard);
        jsonBoard = toJson(board, fullboard);
    }
}
