package generator;

import java.util.Arrays;

<<<<<<< HEAD
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
        BoardMaker b=BoardMaker.createBoard(size);
        fullboard=b.getBoard();
        String json = new String();
        json += "{\"solver\": ";
        json += Arrays.deepToString(fullboard);
        board=b.boardHider(81-visibleFields);
        json += ", \"start_sudoku\": ";
        json += Arrays.deepToString(board);
        json += "}";
        jsonBoard=json;
=======
/**
 * Zamienia planszę na String w formacie json
 */

public class BoardGenerator {

    public int[][] fullboard;
    public int[][] board;
    String jsonBoard;

    public BoardGenerator(int visibleFields) {
        int size = 9;
        if (visibleFields > 81) visibleFields = 81;
        BoardMaker b = BoardMaker.createBoard(size);
        fullboard = b.getBoard();
        String json = new String();
        json += "{\"solver\": ";
        json += Arrays.deepToString(fullboard);
        board = b.boardHider(81 - visibleFields);
        json += ", \"start_sudoku\": ";
        json += Arrays.deepToString(board);
        json += "}";
        jsonBoard = json;
>>>>>>> a1a9759... Fix
    }
}
