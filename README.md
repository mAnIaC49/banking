# csBanking
#### Video Demo: https://youtu.be/rr6kGSF0x3Y
#### Description: 
## Working of the application
CsBanking is a web application that I built by using ***Django*** framework where I have used ***Python*** for backend and ***Javascript*** and ***HTML*** for designing the front-end. This web application is designed to help you in businss/real-estate games such as Monopoly where each player has a specific amount of money in the game and that money is can be increased, decreased or transfered to another player. This is a substitute for the traditional method of using artificial physical currency.
<br>
As soon as you visit the index page, you are redirected to the login page. If you do not have an existing account you can register a new account. No routes can be visited without logging in. The register page checks whether there is already an account with that ID and also whether the two passwords match. The loggin page checks whether the ID and the password match <br>
After logging in the index page is visited. The index page consists of different forms that take in information about the players. First it asks for the number of players, and that information is used by javascript to dynamically create text inputs that take in the names of players. Also two other inputs are displayed in which one takes in the initial balance that everyone has in the start of the game and a select bar where a currency is selected. All of this happens in a single index page.
<br>
The above form is submitted to the game view that processes the information and the game page is rendered. The game page has a seperate division for each players that shows the current balance and lets you add, deduct or transfer money to another player.
<br>
You can also save the game and later load it anytime.

## The Underlying Code

The application is made by using Python, Javascript and HTML.

### HTML

+ The structure of the webpage is made using HTML and is designed using bootstrap. The html files are present in the static/templates/banking folder. 
+ The layout.html file has the general layout for all the pages. This is structured using the ***Jinja*** template language. The login.html and register.html files have the structure for the login and register pages. 
+ The index.html file has the initial forms that take in as input the details of the game. Various divs are displayed and hidden and are manipulated using javascript. 
+ The game.html file further uses jinja to create seperate divisions for each players containing their details and hidden forms that are used to do the addition, substraction and transfer of money.
+ The forms are validated both in the frontend and in the backend.

### Javascript

+ Other than the login, register and the layout files, there are only two application specific pages in the application. Hence the complexity of the application instead lies in the manipulation of the HTML files using javascript.
On loading the DOM, irrespective of the page in, the load button is diabled and an asynchronous request is sent, the response of which shows whether there is a previously saved game. Depending on the response, the load button is enabled.
<br>

+ The rest of the code is divided based on whether it is running on the index page or the game page. If on the index page the javascript manipulates the index page based on the input of the number of players. If on game page, the javascript code checks whether the game is a loaded game. If yes, the page is updated based on the saved data.
<br>

+ The next set of code hides or displays the forms that take as input the amount of money to be added, deducted or transfered to someone based on the button clicked by user. On clicking the transfer button, the select input is is filled with options of the rest of the players.
<br>

+ The next set of code updates the various variables based on the input that the user provided to be added, subtracted or transfered to another player. All of this is done without actuallly submitting the form anywhere.
<br>

+ The last set of javascript code run on clicking the save button. It sends the data of the current state of the game through an asynchronous request.

### Python

Python is used in the backend as views and to manipulate the database. 
<br>

+ The index view simply renders the index.html file.
<br>

+ The login, register and logout views take care of everything involved in the logging in and out of a user and registering a new user by using the django conventional method.
<br>

+ The game view is used when starting a new game and uses the data sent by the form in the index page and renders the game.html file with by providing the details of the players, the initial amount of each player in the beginning and the currency as selected by the user in the form.
<br>

+ The save view simply saves data into the database on clicking the save button. All of this happens through an asynchronous request and no new page is rendered.
<br>

+ The load_info view either sends a response informing whether there exists a previously saved game or a dictionary consisting of the names of the player and the amount they had in the saved game as key value pairs respectively, depending on the kind of request made.
<br>

+ The load_game view simply renders the game.html file but by giving the data from the previously saved game.
<br>

+ The models.py file consists of the various tables used in the application. The User table contains the details of the various registered users. Additionally I have added a field called currency that stores the currency used in the previously saved game by the user. I did this to avoid having to store in the other table which would have stored this single data in various rows.
+ The data table consists of various rows each of a player from a game of. The user field refers to a user in the User table. whose saved game the player belongs to, and the name field and the amount field consists of the name of the player and the amount they had while saving the game.