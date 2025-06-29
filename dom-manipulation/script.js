// script.js

// Array to store quote objects. Each quote has a 'text' and a 'category'.
// This array will now be primarily loaded from and saved to local storage.
let quotes = [];
let filteredQuotes = []; // New: Array to hold quotes after filtering

// Simulated server endpoint (using JSONPlaceholder posts as a stand-in)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
const SYNC_INTERVAL = 60000; // Sync every 60 seconds (60000 milliseconds)

// Get references to DOM elements
const quoteDisplayText = document.getElementById('quoteText');
const quoteDisplayCategory = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteButton = document.getElementById('addQuoteButton');
const exportQuotesButton = document.getElementById('exportQuotesButton');
const importFileInput = document.getElementById('importFile');
const categoryFilterSelect = document.getElementById('categoryFilter');
const syncNowButton = document.getElementById('syncNowButton'); // New: Reference to Sync Now button


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
 * Populates the category filter dropdown with unique categories from the quotes array.
 */
function populateCategories() {
    // Get unique categories using Set and map
    const categories = new Set(quotes.map(quote => quote.category));

    // Clear existing options, except the "All Categories" option
    // The loop starts from 1 to preserve the first option (All Categories)
    while (categoryFilterSelect.options.length > 1) {
        categoryFilterSelect.remove(1);
    }

    // Add new options for each unique category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterSelect.appendChild(option);
    });
    console.log('Categories populated.');
}

/**
 * Filters quotes based on the selected category in the dropdown.
 * Updates the displayed quotes and stores the selected filter in local storage.
 */
function filterQuotes() {
    const selectedCategory = categoryFilterSelect.value;
    localStorage.setItem('lastSelectedCategory', selectedCategory); // Save selected filter to local storage

    if (selectedCategory === 'all') {
        filteredQuotes = [...quotes]; // Copy all quotes
    } else {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    console.log(`Filtered by: ${selectedCategory}. ${filteredQuotes.length} quotes found.`);
    showRandomQuote(filteredQuotes); // Show a random quote from the filtered list
}

/**
 * Displays a random quote from the given 'quoteList' (defaults to 'filteredQuotes').
 * Also stores the last viewed quote in session storage.
 * @param {Array} quoteList - The list of quotes to pick from. Defaults to filteredQuotes.
 */
function showRandomQuote(quoteList = filteredQuotes) {
    if (quoteList.length === 0) {
        quoteDisplayText.innerHTML = "No quotes available for this category. Try adding some or selecting 'All Categories'.";
        quoteDisplayCategory.innerHTML = "";
        sessionStorage.removeItem('lastViewedQuote'); // Clear last viewed if no quotes
        return;
    }

    const randomIndex = Math.floor(Math.random() * quoteList.length);
    const randomQuote = quoteList[randomIndex];

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
 * Clears the input fields after adding the quote, saves the updated array to local storage,
 * and updates the category dropdown.
 * Also attempts to post the new quote to the simulated server.
 */
async function addQuote() {
    const quoteText = newQuoteTextInput.value.trim();
    const quoteCategory = newQuoteCategoryInput.value.trim();

    if (quoteText === "" || quoteCategory === "") {
        showMessageBox("Please enter both a quote and a category.");
        return;
    }

    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };

    quotes.push(newQuote);
    saveQuotes(); // Save quotes to local storage after adding a new one
    populateCategories(); // Update categories dropdown in case a new category was added
    filterQuotes(); // Re-apply current filter and show a random quote from the updated list

    newQuoteTextInput.value = "";
    newQuoteCategoryInput.value = "";

    showMessageBox("Quote added successfully!");

    // Attempt to post the new quote to the server
    await postQuoteToServer(newQuote);
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
 * Parses the JSON, adds quotes to the array, and saves to local storage accordingly.
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
                // For imported quotes, we assume they are new or meant to overwrite existing ones
                // Simple merge: add new ones, overwrite existing ones if text matches (basic conflict resolution)
                importedQuotes.forEach(impQuote => {
                    const existingIndex = quotes.findIndex(q => q.text === impQuote.text);
                    if (existingIndex > -1) {
                        quotes[existingIndex] = impQuote; // Overwrite
                    } else {
                        quotes.push(impQuote); // Add new
                    }
                });

                saveQuotes(); // Save combined quotes to local storage
                populateCategories(); // Update categories dropdown
                filterQuotes(); // Re-apply filter and show a quote from the updated list
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

/**
 * Fetches quotes from the simulated server and merges them with local quotes.
 * Server data takes precedence in case of discrepancies. This function effectively
 * performs the data synchronization.
 */
async function syncQuotes() { // Renamed from mergeAndSyncQuotes
    try {
        showMessageBox("Syncing with server...", true); // Show loading message
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();

        // Simulate a small subset of data or a specific format
        const serverQuotes = serverData.slice(0, 10).map(post => ({ // Take first 10 for simplicity
            text: post.title, // Using title as quote text
            category: 'Server Quote' // Assign a default category for server-fetched
        }));

        console.log('Fetched quotes from server:', serverQuotes);

        let updatesCount = 0;
        let newQuotesCount = 0;

        serverQuotes.forEach(sQuote => {
            const localIndex = quotes.findIndex(lQuote => lQuote.text === sQuote.text); // Simple match by text

            if (localIndex > -1) {
                // Conflict: Quote exists locally. Server data takes precedence.
                // Check if content is different before updating
                if (quotes[localIndex].category !== sQuote.category || quotes[localIndex].text !== sQuote.text) {
                    quotes[localIndex] = { ...sQuote }; // Overwrite with server version
                    updatesCount++;
                    console.log('Updated existing quote from server:', sQuote.text);
                }
            } else {
                // No conflict: New quote from server. Add it.
                quotes.push({ ...sQuote });
                newQuotesCount++;
                console.log('Added new quote from server:', sQuote.text);
            }
        });

        saveQuotes(); // Save the merged quotes to local storage
        populateCategories(); // Re-populate categories in case new ones were added
        filterQuotes(); // Re-apply filter and refresh display

        if (updatesCount > 0 || newQuotesCount > 0) {
            showMessageBox(`Sync successful! ${newQuotesCount} new quotes added, ${updatesCount} existing quotes updated.`);
        } else {
            showMessageBox("Sync successful! No new updates from server.");
        }

    } catch (error) {
        console.error('Failed to fetch quotes from server:', error);
        showMessageBox(`Sync failed: ${error.message}`);
    }
}


/**
 * Simulates posting a new quote to the server.
 * For JSONPlaceholder, this maps to creating a new post.
 * @param {object} quote - The quote object to post.
 */
async function postQuoteToServer(quote) {
    try {
        console.log('Attempting to post new quote to server:', quote);
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // JSONPlaceholder often echoes back the sent data with an ID
            body: JSON.stringify({
                title: quote.text,
                body: `Category: ${quote.category}`,
                userId: 1, // Example user ID
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Quote posted to server successfully:', responseData);
        // Note: For a real app, you might re-fetch from server or update local quote with server ID
    } catch (error) {
        console.error('Failed to post quote to server:', error);
        // showMessageBox(`Failed to post new quote to server: ${error.message}`); // Optional: notify user
    }
}


// --- Event Listeners ---

// Add event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', () => showRandomQuote(filteredQuotes));

// Add event listener to the "Add Quote" button
addQuoteButton.addEventListener('click', addQuote);

// Add event listener to the "Export Quotes" button
if (exportQuotesButton) {
    exportQuotesButton.addEventListener('click', exportQuotes);
}

// Add event listener for the file input change
if (importFileInput) {
    importFileInput.addEventListener('change', importFromJsonFile);
}

// Add event listener for "Sync Now" button
if (syncNowButton) {
    syncNowButton.addEventListener('click', syncQuotes); // Updated call to syncQuotes
}

// Event listener for category filter change is handled by onchange attribute in HTML: onchange="filterQuotes()"


// --- Initial Page Load ---

document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); // Load quotes from local storage
    populateCategories(); // Populate categories based on loaded quotes

    // Attempt to load the last selected category filter
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory && Array.from(categoryFilterSelect.options).some(option => option.value === lastSelectedCategory)) {
        categoryFilterSelect.value = lastSelectedCategory;
    } else {
        categoryFilterSelect.value = 'all'; // Default to 'all' if no filter or invalid
    }

    // Apply the filter and then try to load the last viewed quote
    filterQuotes(); // This will also call showRandomQuote with the initial filtered list

    // Attempt to load the last viewed quote from session storage, but only if it matches the current filter
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        try {
            const parsedQuote = JSON.parse(lastViewedQuote);
            const currentFilter = categoryFilterSelect.value;

            // Only display last viewed quote if it matches the current filter (or filter is 'all')
            if (currentFilter === 'all' || parsedQuote.category === currentFilter) {
                quoteDisplayText.innerHTML = `"${parsedQuote.text}"`;
                quoteDisplayCategory.innerHTML = `- ${parsedQuote.category}`;
                console.log('Last viewed quote loaded from session storage (and matches filter).');
            } else {
                console.log('Last viewed quote does not match current filter. Showing random from filtered list.');
                showRandomQuote(filteredQuotes); // Show a random from the filtered list if no match
            }
        } catch (e) {
            console.error('Error parsing last viewed quote from session storage:', e);
            showRandomQuote(filteredQuotes); // Fallback to a random quote if parsing fails
        }
    } else {
        // If no last viewed quote, just show a random one from the initial filtered list
        showRandomQuote(filteredQuotes);
    }

    // Start periodic synchronization
    setInterval(syncQuotes, SYNC_INTERVAL); // Updated call to syncQuotes
});
