const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Home Page
app.get('/', (req, res) => {
    console.log('Loading home page')
    
    res.send('Hello World!')
})

app.get('/categorise-pdf', (req, res) => {

    // Get text from pdf
    pdfToText('testing-documents/testdoc.pdf')
    .then(value => {
        const { text, cleanedText } = value 

        // Get category from text (sample response only)
        const [cat] = sampleTextClassification(text).categories
        let { name, confidence } = cat

        // Derive categories from text (Google NL API)
        // const categories = classifyText(data.text)
        // console.log('Categories');
        // categories.then(data => {
        //     let { name, confidence } = data
        //     console.log(`Name: ${name}, Confidence: ${confidence}.`);
        // })

        res.send('Woo! 😃 We were able to get the categories from the PDF you provided.')
    })
    
})

/**
 * Retrieve text from a PDF
 *
 * @param {string} file Path to the PDF file
 * @return {string} Text retreived from PDF.
 */
async function pdfToText(file) {
    // Imports the file system with pdf parser
    const fs = require('fs');
    const pdf = require('pdf-parse');

    // Get PDF
    let doc = fs.readFileSync(file)

    // Retrieve text from the PDF
    const { text } = await pdf(doc)

    // Clean text to remove characters
    let cleanedText = text.replace(/(\s\n)/gm, "").replace(/(\n)/gm, " ")

    // Return both text for comparison
    return [
        { text, len: text.length },
        { cleanedText, len: cleanedText.length }
    ]
}

/**
 * Derive categories from text
 *
 * @param {string} text Text to categorise
 * @return {array} Array of categories derived from text
 */
async function classifyText(text) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Creates a client
    const client = new language.LanguageServiceClient();

    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Classifies text in the document
    const [classification] = await client.classifyText({document});
    return classification
}


/**
 * Sample result of text classification for testing
 *
 * @return {obj} Object with categories array
 */
function sampleTextClassification(){
    const category = {
        categories: [
          { name: '/Business & Industrial/Transportation & Logistics/Packaging', confidence: 0.5099999904632568 }
        ]
    }

    return category
}


