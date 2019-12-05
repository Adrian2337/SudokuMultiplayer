package generator;

import java.util.Arrays;

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
    }
}
