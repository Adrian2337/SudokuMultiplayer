<<<<<<< HEAD:java_generator/BoardMaker.java
public class BoardMaker {
    static int[][] board;
    static int size;
=======
package generator;

import java.util.ArrayList;

public class BoardMaker {
     int[][] board;
     int size;
     ArrayList singleRowBoard;
>>>>>>> c51794d... rwgwe:src/generator/BoardMaker.java
    public BoardMaker(int size){
        board = new int[size][size];
        this.size=size;
        for(int i=0; i<9; i++){
            for(int j=0; j<9; j++){
                boolean succes=false;
                while(!succes) {
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

    public static int[][] createBoard(int size){
        BoardMaker maker=new BoardMaker(size);
        return maker.getBoard();
    }



        // n - liczba pól do schowania
<<<<<<< HEAD:java_generator/BoardMaker.java
    public static int[][] boardHider(int fieldsToHide, int[][] Board){
    board=Board;
=======
    public int[][] boardHider(int fieldsToHide){

>>>>>>> c51794d... rwgwe:src/generator/BoardMaker.java
        while(fieldsToHide>0){
            int x=randomInt(9)-1;
            int y=randomInt(9)-1;
            int tmp=0;
            if(board[x][y]!=0){
                tmp=board[x][y];
                board[x][y]=0;
                if(Solver.solveSudokuStarter(board,size)==1){
                    fieldsToHide--;

                }
                else {
                    board[x][y]=tmp;

                }
            }

        }
        return board;
    }



    private static int randomInt(int range){
        double randomDouble = Math.random();
        randomDouble = randomDouble * range + 1;
        int randomInt = (int) randomDouble;
        return  randomInt;
    }


    public int[][] getBoard() {
        return board;
    }
}
