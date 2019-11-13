public class GeneratorTest {

    public static void main(String[] args){
/**
 * zwraca planszę do rozwiązania i planszę z odpowiedziami dla zadanej liczby widocznych pól
 */
        BoardGenerator b=new BoardGenerator(25);
        System.out.println(b.jsonBoard);

    }
}
