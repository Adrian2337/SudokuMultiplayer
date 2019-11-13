import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;

public class BoardGenerator {
    String jsonBoard;
    int[][] fullboard;
    int [][] board;

    public BoardGenerator(int visibleFields){
        int size=9;
        fullboard=BoardMaker.createBoard(size);
        Gson gson = new GsonBuilder().create();
        String json2=gson.toJson(fullboard);
        board=BoardMaker.boardHider(81-visibleFields, fullboard);
        String json=gson.toJson(board);
        JsonArray jsarray=new JsonArray();
        jsarray.add(json2);
        jsarray.add(json);
        jsonBoard=jsarray.toString();

    }

}
