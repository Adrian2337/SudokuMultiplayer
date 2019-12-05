package tests;

import generator.Solver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


class SolverTest {

    int[][] board = {
            {0, 0, 0, 0, 0, 0, 0, 9, 9},
            {0, 1, 0, 9, 8, 0, 2, 5, 3},
            {5, 9, 3, 0, 0, 0, 0, 4, 7},
            {0, 0, 0, 8, 0, 0, 0, 6, 0},
            {0, 4, 0, 0, 0, 0, 0, 8, 0},
            {1, 6, 8, 7, 0, 0, 5, 9, 2},
            {0, 0, 0, 0, 0, 3, 0, 2, 9},
            {0, 2, 0, 0, 0, 0, 0, 3, 0},
            {0, 3, 6, 0, 2, 8, 1, 0, 5}
    };
    int[][] board2 = {
            {0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 1, 0, 9, 8, 0, 2, 5, 0},
            {5, 9, 3, 0, 0, 0, 0, 4, 0},
            {0, 0, 0, 8, 0, 0, 0, 6, 0},
            {0, 4, 0, 0, 0, 0, 0, 8, 0},
            {1, 6, 8, 7, 0, 0, 5, 9, 2},
            {0, 0, 0, 0, 0, 3, 0, 2, 0},
            {0, 2, 0, 0, 0, 0, 0, 3, 0},
            {0, 3, 0, 0, 0, 0, 1, 0, 5}
    };

    Solver s;

    @BeforeEach
    void setUp() {
        s = new Solver();
    }

    @Test
    void solver1() {
        //plansza z błędem
        assertEquals(0, s.solveSudokuStarter(board, 9));

    }

    @Test
    void solver2() {
        //plansza rozwiązwywalna
        assertTrue(s.solveSudokuStarter(board2, 9) > 0);
    }
}
