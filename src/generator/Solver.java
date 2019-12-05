package generator;

/**
 * Rozwiązuje sudoku, używane do tworzenia plansz
 */

public class Solver {

    static int solutions = 0;

    //sprawdza czy można umieścić daną liczbę w danym miejscu
    public static boolean isSafe(int[][] board,
                                 int row, int col,
                                 int num) {

        for (int d = 0; d < board.length; d++) {
            // jeżeli już jest w tym rzędzie to false
            if (board[row][d] == num) {
                return false;
            }
        }


        for (int r = 0; r < board.length; r++) {
            //jeżeli jest w danej kolumnie to false
            if (board[r][col] == num) {
                return false;
            }
        }

        //  jeżeli jest w danym kwadracie to false
        int sqrt = (int) Math.sqrt(board.length);
        int boxRowStart = row - row % sqrt;
        int boxColStart = col - col % sqrt;

        for (int r = boxRowStart;
             r < boxRowStart + sqrt; r++) {
            for (int d = boxColStart;
                 d < boxColStart + sqrt; d++) {
                if (board[r][d] == num) {
                    return false;
                }
            }
        }

        // jeżeli nie zaszło żadne z powyższych to true
        return true;
    }

    //odpala solver
    public static int solveSudokuStarter(int[][] board, int n) {
        solutions = 0;
        solveSudoku(board, n);
        return solutions;
    }

    public static int solveSudoku(int[][] board, int n) {


        int row = -1;
        int col = -1;
        boolean isEmpty = true;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 0) {
                    row = i;
                    col = j;
                    isEmpty = false;
                    break;
                }
            }
            if (!isEmpty) {
                break;
            }
        }

        // plansza jest pełna
        if (isEmpty) {

            solutions++;

            return solutions;
        }

        //próbuj wstawiać kolejne liczby
        for (int num = 1; num <= n; num++) {
            if (isSafe(board, row, col, num)) {
                board[row][col] = num;
                if (solveSudoku(board, n) > 0) {

                    board[row][col] = 0;

                } else {
                    board[row][col] = 0;
                }
            }
        }
        return solutions;
    }


    public static boolean isSolvable(int[][] board, int n) {
        int row = -1;
        int col = -1;
        boolean isEmpty = true;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 0) {
                    row = i;
                    col = j;
                    isEmpty = false;
                    break;
                }
            }
            if (!isEmpty) {
                break;
            }
        }

        // rozwiązane
        if (isEmpty) {


            return true;
        }

        // rozwiązuj dalej
        for (int num = 1; num <= n; num++) {
            if (isSafe(board, row, col, num)) {
                board[row][col] = num;
                if (isSolvable(board, n)) {

                    board[row][col] = 0;
                    return true;
                } else {
                    board[row][col] = 0;
                }
            }
        }
        return false;
    }


    public static void print(int[][] board, int N) {
        for (int r = 0; r < N; r++) {
            for (int d = 0; d < N; d++) {
                System.out.print(board[r][d]);
                System.out.print(" ");
            }
            System.out.print("\n");

            if ((r + 1) % (int) Math.sqrt(N) == 0) {
                System.out.print("");
            }
        }
        System.out.println();
    }

}