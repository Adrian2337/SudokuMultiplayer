package generator;

import java.util.Arrays;

public class BoardGenerator {
    String jsonBoard;
    int[][] fullboard;
    int [][] board;

    public BoardGenerator(int visibleFields){
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
    }
}
