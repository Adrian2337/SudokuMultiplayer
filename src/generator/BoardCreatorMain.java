package generator;

public class BoardCreatorMain {
    public static void main(String args[]){
        try {
            generateBoard(Integer.parseInt(args[0]));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public static String generateBoard(int visibleFields){
        BoardGenerator b=new BoardGenerator(visibleFields);
        System.out.println(b.jsonBoard);
        return  b.jsonBoard;
    }
}
