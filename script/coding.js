
var quotes = [];
var shuffledQuotes = [];

var typingSpeed = 25; 
var typingTimeout = null;

const csvFilePath = 'resources/quotes.csv';

function fetchQuotes() {
    // Fetch the CSV file
    fetch(csvFilePath)
        .then(response => response.text())
        .then(data => {
            // Split the CSV data into lines
            const lines = data.split('\n');
            
            // Initialize the quotes array
            quotes = [];

            // Parse each line to extract quotes and authors
            for (let i = 1; i < lines.length; i++) {
                const [id, quote, author] = lines[i].split(';');
                quotes.push({
                    id: parseInt(id),
                    quote: quote.trim(),
                    author: author.trim()
                });
            }

            // Shuffle the quotes array
            shuffledQuotes = shuffleArray(quotes);
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV:', error);
        });
}

function shuffleArray(array) {
    var shuffledArray = array.slice(); // Create a copy of the original array
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        // Swap elements at i and j
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Function to get and display the next quote
function getNextQuote() {
    if (shuffledQuotes.length === 0) {
        // If all quotes have been displayed, reshuffle the array
        shuffledQuotes = shuffleArray(quotes);
    }

    // Get the next quote from the shuffled array
    var nextQuote = shuffledQuotes.pop();

    // Clear any previous typing timeout
    clearTimeout(typingTimeout);

    // Display the quote in the HTML with typing effect 
    var quoteElement = document.getElementById("quote");
    var authorElement = document.getElementById("author");
    var quoteText = nextQuote.quote;
    var authorText = "- " + nextQuote.author;

    quoteElement.textContent = "";
    authorElement.textContent = authorText; // Display the author immediately

    var index = 0;
    function typeQuote() {
        if (index < quoteText.length) {
            quoteElement.textContent += quoteText.charAt(index);
            index++;
            typingTimeout = setTimeout(typeQuote, typingSpeed);
        }
    }

    typeQuote();

    // Set the text for the tweet
    const tweetText = `${quoteText}  ${authorText}`;

    // Encode the tweet text for use in a URL
    const encodedTweetText = encodeURIComponent(tweetText);

    // Set the href attribute of the "Tweet to Twitter" button
    const tweetButton = document.getElementById("tweetButton");
    tweetButton.href = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;
    tweetButton.removeAttribute("hidden");

    const copyButton = document.getElementById("copy");
    copyButton.removeAttribute("hidden");
    
}

function copyToClipboard() {
    // Select the quote text to copy
    const quoteElement = document.getElementById("quote");
    const quoteText = quoteElement.textContent;

    // Create a temporary textarea element to copy the text
    const textarea = document.createElement("textarea");
    textarea.value = quoteText;
    document.body.appendChild(textarea);

    // Select and copy the text in the textarea
    textarea.select();
    document.execCommand("copy");

    // Remove the temporary textarea
    document.body.removeChild(textarea);

    // Alert the user that the text has been copied
    alert("Quote copied to clipboard!");
}
