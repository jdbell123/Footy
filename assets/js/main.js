// document ready statement to make sure the page fully loads before running this code.
$(document).ready(function () {
  // initialize foundation plugin.
  $(document).foundation();

  // global variables
  var today;
  var today_YYYYMMDD;
  var refreshData = false;
  var storedHeadlineData = [];

  // initialize foundation plugin.
  $(document).foundation();

  // initial function calls.
  initialDateLogic();
  getTickerData();
  buildHeadlineSection();

  // function to do initial date logic work.
  function initialDateLogic() {
    // get current date and make into format of mm/dd/yyyy.
    today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    today_YYYYMMDD = yyyy + mm + dd;

    // get stored date from localStorage.
    var savedDate = localStorage.getItem("savedDate");

    // compare current date and date in local storage to see if we need to refresh the data on the page.
    if (today != savedDate) {
      refreshData = true;
    }
  }

  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // **
  // **  <start> headline section js code <start>
  // **
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************

  function buildHeadlineSection() {
    // check refreshData boolean - this will tell us if we have to call the API or use data from local storage.
    // var refreshData = true; // DEBUG - REMOVE WHEN GOING LIVE (uncomment this to force use of livescore API).
    console.log("refreshData: " + refreshData); //DEBUG - REMOVE WHEN GOING LIVE.
    if (refreshData) {
      // refresh true therefore we will call the livescore API and pull new data.
      callLivescoreApi();
    } else {
      // refresh false therefore we will use the saved headline data from local storage.
      // call function to render headline data to the screen.
      renderHeadlineData();
    }

    // store headline data into local storage.
    function storeHeadlineDataInLocalStorage(headlineText, headlineUrl) {
      var newHeadlineDetails = {
        text: headlineText,
        url: headlineUrl,
      };
      // Get existing stored details
      if (localStorage.getItem("headlineData") != null) {
        storedHeadlineData = JSON.parse(localStorage.getItem("headlineData"));
      }

      storedHeadlineData.push(newHeadlineDetails);
      localStorage.setItem("headlineData", JSON.stringify(storedHeadlineData));
    }

    // get headline data from local storage.
    function getHeadlineDataFromLocalStorage() {
      storedHeadlineData = JSON.parse(localStorage.getItem("headlineData"));
    }

    // function to call the livescore API.
    function callLivescoreApi() {
      // setup ajax livescore api parameters.
      const livescoreParams = {
        async: true,
        crossDomain: true,
        url:
          "https://livescore-football.p.rapidapi.com/soccer/news-list?page=1",
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "ff0210cd47msh983c81cf4ee3a53p1bc6d3jsn78402c8c5e1a",
          "x-rapidapi-host": "livescore-football.p.rapidapi.com",
        },
      };

      // call livescore api.
      $.ajax(livescoreParams).done(function (response) {
        console.log("**** livescore (headlines) API used ****"); //DEBUG - REMOVE WHEN GOING LIVE.
        // as we are pulling new data to display update the saved date in local storage to todays date.
        localStorage.setItem("savedDate", today);
        // clear out old headline data from local storage before loading new data.
        localStorage.removeItem("headlineData");
        // loop thru response data 10 times to get top 10 headlines and then store in local storage.
        for (var i = 0; i < 10; i++) {
          var urlText = response.data[i].title;
          var urlLink = response.data[i].url;
          // call function to store data to local storage.
          storeHeadlineDataInLocalStorage(urlText, urlLink);
        }
        // call function to render headline data to the screen.
        renderHeadlineData();
      });
    }
    // render headline data to the screen.
    function renderHeadlineData() {
      // call function to get headline data from local storage.
      getHeadlineDataFromLocalStorage();
      // loop round local storage headline data and build elements to screen.
      for (let i = 0; i < storedHeadlineData.length; i++) {
        var newHeadline = $("<li>").addClass("headline");
        var newHeadlineLink = $("<a>")
          .attr({ href: storedHeadlineData[i].url, target: "_blank" })
          .text(storedHeadlineData[i].text);
        newHeadline.append(newHeadlineLink);
        $(".headline-section").append(newHeadline);
      }
    }
  }
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // **
  // **  <end> headline section js code <end>
  // **
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // **
  // **  <start> statistics section js code <start>
  // **
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // Stores the value of the teamSearchBtn input by user and places it inside url
  var teamSearch = "Real_Madrid"; // $("#teamSearchBtn").val();

  //Calls left cell of main container
  function getTeamOverview() {
    // setup ajax livescore api parameters.
    const searchTeamInfo = {
      async: true,
      crossDomain: true,
      url:
        "https://api-football-v1.p.rapidapi.com/v2/teams/search/" + teamSearch,
      method: "GET",
      headers: {
        "x-rapidapi-key": "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    $.ajax(searchTeamInfo).done(function (response) {
      // console.log(response);

      // Grabs team ID to use as the parameter for another AJAX call
      var teamID = response.api.teams[0].team_id;
      // Stores the team logo url, the team name, country of origin, and founding date
      var logo = response.api.teams[0].logo;
      var name = response.api.teams[0].name;
      var founding = response.api.teams[0].founded;
      var country = response.api.teams[0].country;
      var stadium = response.api.teams[0].venue_name;
      var stadiumCap = response.api.teams[0].venue_capacity;



      var teamLogo = $("<img style='width:50px; height:50px'>")
        .addClass("team-logo")
        .attr("src", logo)
        .appendTo($(".divL"));

      var teamName = $("<h4>")
        .addClass("team-name")
        .text(name)
        .appendTo($(".divL"));

      var foundingDate = $("<p>")
        .addClass("founding-date")
        .text("Founded: " + founding)
        .appendTo($(".secL"));

      var teamCountry = $("<p>")
        .addClass("team-country")
        .text("Country: " + country)
        .appendTo($(".secL"));

      var teamStadium = $("<p>")
        .addClass("team-stadium")
        .text("Stadium: " + stadium)
        .appendTo($(".secL"));

      var teamStadiumCap = $("<p>")
        .addClass("team-stadium-cap")
        .text("Capacity: " + stadiumCap)
        .appendTo($(".secL"));

      // Gets current team wins and lineups
      function getTeamWinsLineups() {
        const searchTeamStats = {
          async: true,
          crossDomain: true,
          url:
            "https://api-football-v1.p.rapidapi.com/v2/leagues/team/" + teamID,
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          },
        };

        $.ajax(searchTeamStats).done(function (response) {
          //   console.log(response);

          // Creates a card and card title to be placed in the center column of main container
          var cardCenterMain = $("<div>")
            .addClass("card card-center-main")
            .appendTo($(".cell-center-main"));

          // stores api response for the list of titles a team has won
          var titles = response.api.leagues;
          // Tracks the number of title and cup wins in order to count and display the total
          var titleWins = 0;
          var cupWins = 0;

          // loops through total tital wins and adds +1 depeding on if it was a league title or cup title
          for (var i = 0; i < titles.length; i++) {
            if (titles[i].type == "League") {
              titleWins++;
            } else if (titles[i].type == "Cup") {
              cupWins++;
            }
          }
          // Appends titles won (league and cup)
          var Titles = $("<h4>")
            .addClass("titles")
            .text("Titles Won")
            .appendTo($(".divM"));
          var leagueTitles = $("<p>")
            .addClass("league-titles")
            .text("League Titles: " + titleWins)
            .appendTo($(".secM"))
          var cupTitles = $("<p>")
            .addClass("cup-list")
            .text("Cup Titles: " + cupWins)
            .appendTo($(".secM"));
        });
      }
      // function that gets the starting lineup of a club
      function getStartingLineup() {
        var currentSeason = 2019; // Could use new Date() for teams with up to date lineups.. until then use 2019
        const searchTeamStats = {
          async: true,
          crossDomain: true,
          url:
            "https://api-football-v1.p.rapidapi.com/v2/players/squad/" +
            teamID +
            "/" +
            currentSeason,
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          },
        };

        $.ajax(searchTeamStats).done(function (response) {
          // console.log(response);

          // Lineup header appended to divR
          var lineupHeader = $("<h4>")
            .addClass("starting-lineup-header")
            .text("Current Lineup:")
            .appendTo($(".divR"));

          // object shortcut variable
          var startingLineup = response.api.players;
          // loops 11 times to get the starting 11 players
          for (var i = 0; i < 11; i++) {
            var playerName = startingLineup[i].player_name;
            var playerPosition = startingLineup[i].position;
            var playerAge = startingLineup[i].age;
            var playerInfoCol = $("<p style='font-size: 12px'>")
              .addClass("lineup-col")
              .text(
                playerName + ", " + playerPosition
              )
              .appendTo($(".secR"));
          }
        });
      }

      // Function that retrieves upcoming fixture information
      function getUpcomingFixtures() {
        const upcomingFixtures = {
          async: true,
          crossDomain: true,
          url:
            "https://api-football-v1.p.rapidapi.com/v2/fixtures/team/" +
            teamID,
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          },
        };

        $.ajax(upcomingFixtures).done(function (response) {
          console.log(response);
          // object shortcut variable
          var fixtures = response.api.fixtures;

          // Returns 5 values
          for (var k = 0; k < 5; k++) {
            // If the match status is not FT (full time)
            if (fixtures[k].statusShort != "FT") {
              console.log(fixtures[k].awayTeam.team_name + " vs. " + fixtures[k].homeTeam.team_name);

              // Stores variables for home team, away team, logos, match date, and match type
              var homeTeam = fixtures[k].homeTeam.team_name;
              var homeLogo = fixtures[k].homeTeam.logo;
              var awayTeam = fixtures[k].awayTeam.team_name;
              var awayLogo = fixtures[k].awayTeam.logo;
              var matchDate = fixtures[k].event_date;
              var matchType = fixtures[k].league.name;
            }
          }
        })
      }
      // getStartingLineup();
      // getTeamWinsLineups();
      // getUpcomingFixtures();
    });
  }

  // getTeamOverview();
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // **
  // **  <end> statistics section js code <end>
  // **
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // **  
  // **  <start> populate ticker with data <start>
  // **  
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************

  function getTickerData() {
    if (refreshData) {
      // refresh true therefore we will call the livescore API and pull new data for the ticker.
      callTickerApi();
    } else {
      // refresh false therefore we will use the saved ticker data from local storage.
      // call function to render ticker data to the screen.
      var storedTickerData = getTickerDataFromLocalStorage();
      renderTickerData(storedTickerData);
    }

    function callTickerApi() {

      const tickerSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://livescore-football.p.rapidapi.com/soccer/matches-by-date?date=" + today_YYYYMMDD,
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "ff0210cd47msh983c81cf4ee3a53p1bc6d3jsn78402c8c5e1a",
          "x-rapidapi-host": "livescore-football.p.rapidapi.com"
        }
      };

      $.ajax(tickerSettings).done(function (response) {
        console.log("**** livescore (ticker) API used ****"); //DEBUG - REMOVE WHEN GOING LIVE.
        storeTickerDataInLocalStorage(response);
        renderTickerData(response);
      });
    }

    // store ticker data into local storage.
    function storeTickerDataInLocalStorage(tickerData) {
      localStorage.setItem("tickerData", JSON.stringify(tickerData));
    }

    // retrieve ticker data from local storage.
    function getTickerDataFromLocalStorage() {
      return JSON.parse(localStorage.getItem("tickerData"));
    }

    // render ticker data to the screen.
    function renderTickerData(tickerData) {
      var dateData = $("<li>").css({ 'color': 'aqua', 'font-weight': 'bold' }).text("Latest Games For " + today);
      $(".marquee-content-items").append(dateData);
      for (var i = 0; i < 5; i++) {
        var leagueName = tickerData.data[i].league_name;
        var leagueCountry = tickerData.data[i].country_name;
        var leagueData = $("<li>").css({ 'color': 'black', 'font-weight': 'bold' }).text(leagueName + " (" + leagueCountry + "):");
        $(".marquee-content-items").append(leagueData);
        for (var j = 0; j < tickerData.data[i].matches.length; j++) {
          var homeTeamName = tickerData.data[i].matches[j].team_1.name;
          if (tickerData.data[i].matches[j].status === "FT") {
            var scoreText = " " + tickerData.data[i].matches[j].score.full_time.team_1 + " - " + tickerData.data[i].matches[j].score.full_time.team_2 + " ";
          }
          else {
            var scoreText = " v ";
          }
          var awayTeamName = tickerData.data[i].matches[j].team_2.name;
          var gameData = $("<li>").text(homeTeamName + scoreText + awayTeamName);
          $(".marquee-content-items").append(gameData);
        }
      }
      let options = {
        duration: 200000
      }
      // initialize marquee plugin.
      $('.simple-marquee-container').SimpleMarquee(options);
    }
  }
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // **  
  // **  <end> populate ticker with data <end>
  // **  
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
});
