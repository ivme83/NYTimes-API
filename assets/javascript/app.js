var searchAPI = {
    results: 0,

    searchNYT: function(qy, r, sy, ey) {
        this.results = r;
        //console.log(qy + " - " + r + " - " + sy + " - " + ey);
        
        if (sy === undefined && ey === undefined) {

            this.searchWOD(qy);
        } else if (ey === undefined) {

            this.searchWS(qy, sy);
        } else {

            this.searchWSWE(qy, sy, ey);
        }

    },
    // Search with no dates
    searchWOD: function(qy) {

        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
          'api-key': "ee5496b7259c4fa59d8d241cf2926c1d",
          'q': qy
        });
        $.ajax({
          url: url,
          method: 'GET',
        }).then(function(response){
            searchAPI.drawResults(response);
        });
    },
    // Search with start date
    searchWS: function(qy, sy) {

        var startYear = sy + "0101";
        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
          'api-key': "ee5496b7259c4fa59d8d241cf2926c1d",
          'q': qy,
          'begin_date': startYear
        });
        $.ajax({
          url: url,
          method: 'GET',
        }).then(function(response){
            searchAPI.drawResults(response);
        });
    },
    // Search with start date and end date
    searchWSWE: function(qy, sy, ey) {

        var startYear = sy + "0101";
        var endYear = ey + "0101";
        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
          'api-key': "ee5496b7259c4fa59d8d241cf2926c1d",
          'q': qy,
          'begin_date': startYear,
          'end_date': endYear
        });
        $.ajax({
          url: url,
          method: 'GET',
        }).then(function(response){
            console.log(url);
            searchAPI.drawResults(response);           
        });
    },

    drawResults: function(obj) {
        var resp = obj.response.docs; 
        console.log(resp);
               
        
        var resultsDiv = $("<div>");
        resultsDiv.addClass("results-main");

        for (var i = 0; i < this.results; i++) {

            var headline = resp[i].headline.main;
            var author = resp[i].byline.original;
            var pubDate = resp[i].pub_date;
            var articleURL = resp[i].web_url;
            
            var articleDiv = $("<div>");
            articleDiv.addClass("card border-dark mb03");
            articleDiv.attr("style", "max-width: auto;");

            var headerDiv = $("<div>");
            headerDiv.addClass("card-header");
            headerDiv.text(headline);

            var bodyDiv = $("<div>");
            bodyDiv.addClass("card-body text-dark");

            bodyDiv.append("<h5 class='card-title'>" + author + "</h5>");
            bodyDiv.append("<h5 class='card-title'>" + pubDate.substring(0, 10) + "</h5>");

            var link = $("<a>");
            link.attr("href", articleURL);
            link.text(articleURL);

            articleDiv.append(headerDiv);
            articleDiv.append(bodyDiv);
            articleDiv.append(link);
            resultsDiv.append(articleDiv);
            
        }

        $("#article-card").append(resultsDiv);

    }

}

// Search Button Event
$("#run-search").on("click", function(event) {
    event.preventDefault();
    $("#article-card").empty();

    var searchTerm = $("#search-field").val().trim();
    var resultsVal = $("#num-results").val();
    var startYearVal = $("#start-field").val();
    var endYearVal = $("#end-field").val();

    if(parseInt(endYearVal)) {

        searchAPI.searchNYT(searchTerm, resultsVal, startYearVal, endYearVal);
    } else if(parseInt(startYearVal)) {

        searchAPI.searchNYT(searchTerm, resultsVal, startYearVal);
    } else {

        searchAPI.searchNYT(searchTerm, resultsVal);
    }
    
});

// Clear Button Event
$("#clear-all").on("click", function(){
    $("#article-card").empty();

    searchTerm = "";
    resultsVal = "";
    startYearVal = "";
    endYearVal = "";
});