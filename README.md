To run Sudoku, need to: 

1 - Compile Java Classes

Inside folder src/generator, run the terminal, then run command: 
###### `javac *.java`

2 - Have Node.js and npm installed

That app also requires having Node.js and npm installed. If you need to install libraries from npm by yourself (they are set in package-json files), run these commands:
###### npm install socket.io
###### npm install --save-dev nodemon
###### npm install express ejs

3 - Have MySQL installed

Inside terminal, run: 
##### mysql -u your_name -p

To load the sql file into mysql enter this command:
##### mysql -u your_name -p < sudokuDB.sql (RECCOMENDED: use whole path)

Then write your password and run the script from db.sql file. Inside server.js code, in line 13, set your connection as following:

##### var connection = mysql.createConnection({
##### host: 'localhost',
##### user: 'your_name',
##### password: 'your_password',
##### database: 'sudokuDB',
##### });

4 - Run the script inside your terminal: 

##### npm run start
