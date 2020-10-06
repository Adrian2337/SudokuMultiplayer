To run Sudoku, need to: 

1. Compile Java Classes

Inside folder src/generator, run the terminal, then run command: `javac *.java`. Tested and worked on Java 15.

2. Have Node.js and npm installed

That app also requires having Node.js & npm installed. After installing npm, inside main project folder, run this command:

```
npm i socket.io express express-session nodemon mysql ejs
```

3. Have MySQL installed

Inside terminal, run: 
`mysql -u your_name -p`

To load the sql file into mysql enter this command:
`mysql -u your_name -p < db.sql` (RECOMMENDED: use whole path) 

Then write your password and run the script from db.sql file. Inside server.js code, in line 13, set your connection as following:

``` var connection = mysql.createConnection({
host: 'localhost',
user: 'your_name',
password: 'your_password',
database: 'sudokuDB',
 }); 
 ```
 
 Tested and worked on MySQL 8.0.21.

4. Run the script inside your terminal: 

`npm run start`

To test the game, server runs on port 8080, so in your browser, go into ```127.0.0.1:8080```. Create an account and log into the game, then either join or create a new room. For a bit more global testing, you can use and configure as written at https://localhost.run/.
