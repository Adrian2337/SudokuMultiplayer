package generator;

import java.util.ArrayList;

/**
 * Tworzy planszę przy użyciu solvera
 */

public class BoardMaker {

    int[][] board;
    int size;
    ArrayList singleRowBoard;

    public BoardMaker(int size) {
        board = new int[size][size];
        singleRowBoard = new ArrayList();

        this.size = size;
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                boolean succes = false;
                while (!succes) {
                    int x = randomInt(9);

                    while (!Solver.isSafe(board, i, j, x)) {
                        x = randomInt(9);
                    }
                    board[i][j] = x;
                    if (Solver.isSolvable(board, 9)) {
                        succes = true;
                    }
                }
            }

        }

    }

    public static BoardMaker createBoard(int size) {
        BoardMaker maker = new BoardMaker(size);
        return maker;
    }

    private static int randomInt(int range) {
        double randomDouble = Math.random();
        randomDouble = randomDouble * range + 1;
        int randomInt = (int) randomDouble;
        return randomInt;
    }

    // n - liczba pól do schowania
    public int[][] boardHider(int fieldsToHide) {

        while (fieldsToHide > 0) {
            int x = randomInt(9) - 1;
            int y = randomInt(9) - 1;
            int tmp = 0;
            if (board[x][y] != 0) {
                tmp = board[x][y];
                board[x][y] = 0;
                if (Solver.solveSudokuStarter(board, size) == 1) {
                    fieldsToHide--;

                } else {
                    board[x][y] = tmp;

                }
            }

        }
        return board;
    }

    public int[][] getBoard() {
        return board;
    }
}