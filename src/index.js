//This function is called when the user submits their earch request.
// This is where you handle what happens when the usr searches
document.getElementById("search").addEventListener("submit", function (event) {
  //Gets the value of the users input
  let input = document.getElementById("destination").value;

  //------------------------------------------------------------------------
  //TASK 1
  //error checking on user input
  input = errorCheck(input);
  //------------------------------------------------------------------------

  //now we need to get information from our database which is held in a json file
  readFile(input);

  //The following two lines prevent the page from reloading when the form is submitted
  event.preventDefault();
  return false;
});

function errorCheck(userInput) {
  //The example here is to capitalise the first letter of the input
  //you could also remove spaces and perform additional error checking functions
  const capitalisedInput =
    userInput.charAt(0).toUpperCase() + userInput.slice(1);
  //The capitalisation is done by taking the first letter of the input and converting it
  //to upper case then adding the first letter back to the input
  return capitalisedInput;
}

// This function retreieves data from the database contained in the local
// database.json file. You can then call functions inside this.
function readFile(input) {
  const fs = require("fs");
  fs.readFile("src/database.json", "utf8", (err, jsonString) => {
    //error checkign to make sure that the database is read correctly
    if (err) {
      //This line will print if an error occurs
      console.log("Error reading file from disk:", err);
      return;
    }
    // the try catch method is used as an error prevention method. The code
    // in the 'try' section is run and if errors occur then the 'catch'
    // code is run
    try {
      //this is our boolean to see if there is a match in the database, this
      //is used to implement TASK 4
      //---------------
      let matchFound = false;
      //create an empty array
      let matchingFirstLetter = [];
      //---------------
      // create an array of objects which will be each country
      var countries = JSON.parse(jsonString);
      //loop through each country
      countries.forEach(function (country) {
        //------------------------------------------------------------------------
        // TASK 2 and 3 and 4
        if (country.name === input) {
          matchFound = true;
          let newline = "\r\n";
          let message = "Name: " + JSON.stringify(country.name);
          message += newline;
          message += "Price: £" + JSON.stringify(country.price);
          //this line removes apostrophes from the strings
          message = message.replace(/"/g, "");
          alert(message);
        } else if (country.name.charAt(0) === input.charAt(0)) {
          //This is part of task 4 extension
          //Rather than running back through the whole list of countries
          //the check for first letter matching is done here
          //This means that the code will only ever have to run through the whole database once.
          matchingFirstLetter.push(country.name);
        }
      });
      if (matchFound === false) {
        //call method for task 4
        //task4smallDatabase(input);

        task4largeDatabase(matchingFirstLetter, input);
      }
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
}

// This is an optional function to write data to the database. You do not need this function
// unless you finish all tasks and want to add more functionality.
function writeFile() {
  const fs = require("fs");
  fs.readFile("src/database.json", "utf8", (err, jsonString) => {
    //error checkign to make sure that the database is read correctly
    if (err) {
      //This line will print if an error occurs
      console.log("Error reading file from disk:", err);
      return;
    }
    // the try catch method is used as an error prevention method. The code
    // in the 'try' section is run and if errors occur then the 'catch'
    // code is run
    try {
      // create an array of objects which will be each country
      var countries = JSON.parse(jsonString);
      //loop through each country
      countries.forEach(function (country) {
        // YOUR CODE HERE
      });

      var stringCountries = JSON.stringify(countries);

      fs.writeFile("src/blank.json", stringCountries, (err) => {
        if (err) {
          console.log("Error writing file", err);
        } else {
          console.log("Successfully wrote file");
        }
      });
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
}

function task4smallDatabase(input) {
  const fs = require("fs");
  fs.readFile("src/smalldatabase.json", "utf8", (err, jsonString) => {
    //error checkign to make sure that the database is read correctly
    if (err) {
      //This line will print if an error occurs
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      var countries = JSON.parse(jsonString);
      var orderedDistance = {};
      //loop through each country
      countries.forEach(function (country) {
        let distance = levenshtein(country.name, input);
        orderedDistance[distance] = country.name;
      });
      console.log(orderedDistance);
      let message =
        "There were no results in the database for your search term.\r\n Could you have meant to search for one of these?:";
      for (var i = 0; i < 3; i++) {
        if (i in orderedDistance) {
          let newline = "\r\n";
          message += newline;
          message += orderedDistance[i];
        }
      }
      alert(message);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
}

function task4largeDatabase(countries, input) {
  //There are many different ways that this function could be implemented
  //The method here first finds all the data that matches the first letter (this was created
  // in the lines just before this function is called, at the end of task 3) and then checks the levenshtein distance
  //for this list
  var orderedDistance = {};
  //loop through each country
  countries.forEach(function (country) {
    let distance = levenshtein(country, input);
    orderedDistance[distance] = country;
  });
  let message =
    "There were no results in the database for your search term.\r\n Could you have meant to search for one of these?:";
  for (var i = 0; i < 5; i++) {
    if (i in orderedDistance) {
      let newline = "\r\n";
      message += newline;
      message += orderedDistance[i];
    }
  }
  alert(message);
}

// Dont worry about this function until Task 4
// This function works to check how similar two strings are
//------------------------------------------------------------------------
// TASK 4
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

