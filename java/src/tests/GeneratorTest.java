package tests;

import generator.BoardGenerator;
import generator.Solver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;


class GeneratorTest {


    int[][] board;
    BoardGenerator c, d, f, e;

    @BeforeEach
    void setUp() {
        BoardGenerator b = new BoardGenerator(50);
        board = b.board;
        c = new BoardGenerator(40);
        d = new BoardGenerator(60);
        e = new BoardGenerator(70);
        f = new BoardGenerator(80);
    }

    @Test
    void generator() {
        //poprawna plansza powinna mieć dokładnie 1 rozwiązanie
        assertEquals(1, Solver.solveSudokuStarter(board, 9));
    }

    @Test
    void generator2() {
        //poprawna plansza powinna mieć dokładnie 1 rozwiązanie
        board = c.board;
        assertEquals(1, Solver.solveSudokuStarter(board, 9));
    }

    @Test
    void generator3() {
        //poprawna plansza powinna mieć dokładnie 1 rozwiązanie
        board = d.board;
        assertEquals(1, Solver.solveSudokuStarter(board, 9));
    }

    @Test
    void generator4() {
        //poprawna plansza powinna mieć dokładnie 1 rozwiązanie
        board = e.board;
        assertEquals(1, Solver.solveSudokuStarter(board, 9));
    }

    @Test
    void generator5() {
        //poprawna plansza powinna mieć dokładnie 1 rozwiązanie
        board = f.board;
        assertEquals(1, Solver.solveSudokuStarter(board, 9));
    }

}
