
var quotes = [];
var shuffledQuotes = [];

var typingSpeed = 25; 
var typingTimeout = null;


/* function fetchQuotes() {
    quotes.push({ 
        id: 1, 
        quote: '"Try not to become a person of success, but rather try to become a person of value."', 
        author: "Albert Einstein" 
    });
    quotes.push({ 
        id: 2, 
        quote: '"Your ability to discipline yourself to set clear goals, and then to work toward them every day, will do more to guarantee your success than any other single factor."', 
        author: "Brian Tracy" 
    });
    quotes.push({
        id: 3,
        quote: '"There are no secrets to success. It is the result of preparation, hard work, and learning from failure."',
        author: "Colin Powell"
    });
    quotes.push({ 
        id: 4, 
        quote: '"Success is not final, failure is not fatal; it is the courage to continue that counts."', 
        author: "Winston Churchill" 
    });
    quotes.push({ 
        id: 5, 
        quote: '"Some people dream of success, while other people get up every morning and make it happen."', 
        author: "Wayne Huizenga" 
    });
    quotes.push({
        id: 6,
        quote: '"As long as you are learning, you are not failing."',
        author: "Bob Ross"
    })
    quotes.push({
        id: 7,
        quote: '"Life will only change when you become more committed to your dreams than you are to your comfort zone."',
        author: "Billy Cox"
    })

    shuffledQuotes = shuffleArray(quotes);
} */

// Modify the path to your CSV file as needed
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
                const [id, quote, author] = lines[i].split(',');
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
