// script.js

// Array to store quote objects. Each quote has a 'text' and a 'category'.
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "The mind is everything. What you think you become.", category: "Mindset" }
];

// Get references to DOM elements
const quoteDisplayText = document.getElementById('quoteText'); // Added an id for the quote text
const quoteDisplayCategory = document.getElementById('quoteCategory'); // Added an id for the quote category
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteButton = document.getElementById('addQuoteButton');

/**
 * Displays a random quote from the 'quotes' array in the 'quoteDisplay' div.
 */
function showRandomQuote() {
    // Check if there are any quotes available
    if (quotes.length === 0) {
        quoteDisplayText.innerHTML = "No quotes available. Add some!"; // Changed to innerHTML
        quoteDisplayCategory.innerHTML = ""; // Changed to innerHTML
        return;
    }

    // Generate a random index to pick a quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the HTML content of the quote display elements using innerHTML
    quoteDisplayText.innerHTML = `"${randomQuote.text}"`; // Changed to innerHTML
    quoteDisplayCategory.innerHTML = `- ${randomQuote.category}`; // Changed to innerHTML
}

/**
 * Adds a new quote to the 'quotes' array based on user input from the form.
 * Clears the input fields after adding the quote.
 */
function addQuote() {
    const quoteText = newQuoteTextInput.value.trim();
    const quoteCategory = newQuoteCategoryInput.value.trim();

    // Validate inputs
    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and a category."); // Using alert for simplicity, though a custom modal would be preferred in production
        return;
    }

    // Create a new quote object
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };

    // Add the new quote to the array
    quotes.push(newQuote);

    // Clear the input fields
    newQuoteTextInput.value = "";
    newQuoteCategoryInput.value = "";

    // Optionally, show the newly added quote or a new random quote
    showRandomQuote(); // Display a new random quote including the one just added
    alert("Quote added successfully!"); // Using alert for simplicity, a custom notification would be better
}

// --- Event Listeners ---

// Add event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Add event listener to the "Add Quote" button
addQuoteButton.addEventListener('click', addQuote);

// --- Initial Page Load ---

// Display an initial random quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);
