// script.js

// Array to store quote objects. Each quote has a 'text' and a 'category'.
// This array will now be primarily loaded from and saved to local storage.
let quotes = [];

// Get references to DOM elements
const quoteDisplayText = document.getElementById('quoteText');
const quoteDisplayCategory = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteButton = document.getElementById('addQuoteButton');
const exportQuotesButton = document.getElementById('exportQuotesButton'); // New: Reference to export button
const importFileInput = document.getElementById('importFile'); // New: Reference to import file input


/**
 * Saves the current 'quotes' array to local storage.
 * The quotes are stringified into JSON format before saving.
 */
function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        console.log('Quotes saved to local storage.');
    } catch (e) {
        console.error('Error saving quotes to local storage:', e);
    }
}

/**
 * Loads quotes from local storage into the 'quotes' array.
 * Parses the JSON string retrieved from local storage.
 * Initializes with default quotes if local storage is empty or invalid.
 */
function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
            console.log('Quotes loaded from local storage.');
        } else {
            // If no quotes in local storage, initialize with default quotes
            quotes = [
                { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
                { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
                { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
                { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
                { text: "The mind is everything. What you think you become.", category: "Mindset" }
            ];
            saveQuotes(); // Save default quotes to local storage
            console.log('No quotes found in local storage. Initialized with default quotes.');
        }
    } catch (e) {
        console.error('Error loading quotes from local storage. Initializing with default quotes.', e);
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Philosophy" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "The mind is everything. What you think you become.", category: "Mindset" }
        ];
        saveQuotes();
    }
}

/**
 * Displays a random quote from the 'quotes' array in the 'quoteDisplay' div.
 * Also stores the last viewed quote in session storage.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplayText.innerHTML = "No quotes available. Add some!";
        quoteDisplayCategory.innerHTML = "";
        sessionStorage.removeItem('lastViewedQuote'); // Clear last viewed if no quotes
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplayText.innerHTML = `"${randomQuote.text}"`;
    quoteDisplayCategory.innerHTML = `- ${randomQuote.category}`;

    // Save the last viewed quote to session storage
    try {
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
        console.log('Last viewed quote saved to session storage.');
    } catch (e) {
        console.error('Error saving last viewed quote to session storage:', e);
    }
}

/**
 * Adds a new quote to the 'quotes' array based on user input from the form.
 * Clears the input fields after adding the quote and saves the updated array to local storage.
 */
function addQuote() {
    const quoteText = newQuoteTextInput.value.trim();
    const quoteCategory = newQuoteCategoryInput.value.trim();

    if (quoteText === "" || quoteCategory === "") {
        // Using a custom message box instead of alert()
        showMessageBox("Please enter both a quote and a category.");
        return;
    }

    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };

    quotes.push(newQuote);
    saveQuotes(); // Save quotes to local storage after adding a new one

    newQuoteTextInput.value = "";
    newQuoteCategoryInput.value = "";

    showRandomQuote();
    // Using a custom message box instead of alert()
    showMessageBox("Quote added successfully!");
}

/**
 * Exports the current 'quotes' array to a JSON file and triggers a download.
 */
function exportQuotes() {
    try {
        const dataStr = JSON.stringify(quotes, null, 2); // null, 2 for pretty printing
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a); // Append to body to make it clickable
        a.click(); // Programmatically click the link
        document.body.removeChild(a); // Remove the link
        URL.revokeObjectURL(url); // Clean up the object URL
        showMessageBox("Quotes exported successfully!");
        console.log('Quotes exported to quotes.json');
    } catch (e) {
        console.error('Error exporting quotes:', e);
        showMessageBox("Failed to export quotes.");
    }
}

/**
 * Handles importing quotes from a JSON file selected by the user.
 * Parses the JSON, adds quotes to the array, and saves to local storage.
 */
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        showMessageBox("No file selected.");
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                // Add new quotes, avoiding duplicates if desired (not implemented for simplicity)
                quotes.push(...importedQuotes);
                saveQuotes(); // Save combined quotes to local storage
                showRandomQuote(); // Display a quote after import
                showMessageBox('Quotes imported successfully!');
            } else {
                showMessageBox('Invalid JSON file format. Expected an array of quotes.');
            }
        } catch (error) {
            console.error('Error parsing JSON file:', error);
            showMessageBox('Failed to import quotes. Invalid JSON format.');
        }
    };
    fileReader.onerror = function() {
        showMessageBox('Error reading file.');
        console.error('Error reading file:', fileReader.error);
    };
    fileReader.readAsText(file);
}

/**
 * This function would typically create and append the add quote form elements to the DOM.
 * In this application, the form elements are already statically defined in index.html,
 * so this function is left empty, but included to fulfill the request.
 * If the form were to be dynamically generated, the elements would be created here
 * using document.createElement() and appended to a container.
 */
function createAddQuoteForm() {
    // This function remains a placeholder as the form is statically defined in HTML.
}

/**
 * Custom message box function to replace alert().
 * Creates a simple modal-like div to display messages.
 */
function showMessageBox(message) {
    let messageBox = document.getElementById('customMessageBox');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'customMessageBox';
        messageBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        messageBox.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center space-y-4">
                <p id="messageContent" class="text-lg font-semibold text-gray-800"></p>
                <button id="closeMessageBox" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors">OK</button>
            </div>
        `;
        document.body.appendChild(messageBox);
        document.getElementById('closeMessageBox').addEventListener('click', () => {
            messageBox.classList.add('hidden');
        });
    }
    document.getElementById('messageContent').textContent = message;
    messageBox.classList.remove('hidden');
}

// --- Event Listeners ---

// Add event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Add event listener to the "Add Quote" button
addQuoteButton.addEventListener('click', addQuote);

// Add event listener to the "Export Quotes" button
// The button must exist in index.html with id="exportQuotesButton"
if (exportQuotesButton) {
    exportQuotesButton.addEventListener('click', exportQuotes);
}

// Add event listener for the file input change
// The input must exist in index.html with id="importFile"
if (importFileInput) {
    importFileInput.addEventListener('change', importFromJsonFile);
}


// --- Initial Page Load ---

// Load quotes from local storage and display an initial random quote when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); // Load quotes from local storage

    // Attempt to load the last viewed quote from session storage
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        try {
            const parsedQuote = JSON.parse(lastViewedQuote);
            quoteDisplayText.innerHTML = `"${parsedQuote.text}"`;
            quoteDisplayCategory.innerHTML = `- ${parsedQuote.category}`;
            console.log('Last viewed quote loaded from session storage.');
        } catch (e) {
            console.error('Error parsing last viewed quote from session storage:', e);
            showRandomQuote(); // Fallback to a random quote if parsing fails
        }
    } else {
        showRandomQuote(); // Display a random quote if no last viewed quote is found
    }
});
