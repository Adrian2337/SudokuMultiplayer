<h1 align="center">Sudoku Multiplayer</h1>

### Prerequisites

You need to download and install:
- Java Development Kit (tested on versions <a href="https://www.oracle.com/java/technologies/javase-downloads.html#JDK8">8</a> and <a href="https://www.oracle.com/java/technologies/javase-jdk15-downloads.html">15</a>)
- MySQL (Windows installer: <a href="https://dev.mysql.com/downloads/installer/">here</a>)
- <a href="https://nodejs.org/en/download/">Node.js & npm</a>

### How to run Sudoku?

1. Compile Java Classes

From main project folder, run: ```cd src/generator && javac *.java```.

2. Install necessary npm dependencies

Inside main project folder, run this command:

```
npm i socket.io express express-session nodemon mysql ejs
```

3. Configure database

From main project folder, run: (-p requires password) 
`mysql -u your_name -p < db.sql`

Inside server.js code, in line 13, set your connection as following:

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
