const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const pdf = require('pdf-parse');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Home Page
app.get('/', (req, res) => {
    console.log('Loading home page')
    
    res.send('Hello World!')
})


// Categorisation of PDF
app.get('/categorise-pdf', (req, res) => {

    // Get PDF
    let doc = fs.readFileSync('testing-documents/testdoc.pdf')

    // Retrieve text from the PDF
    pdf(doc).then(data => {
        // Derive categories from text
        // const categories = classifyText(data.text)
        // categories.then(data => {
        //     console.log(data);
        // })
        const cat = sampleTextClassification().categories[0]
        res.send(`The top category was ${cat[0].name} with ${cat[0].confidence}.`)
    })
    .catch(error => {
        // handle exceptions
        console.log('Something went wrong! 🤯');
         
    })
    
    // res.send('Processing PDF... 🤓')
})

/**
 * Retrieve text from a PDF
 *
 * @param {string} file Path to the PDF file
 * @return {string} Text retreived from PDF.
 */
function pdfToText(file) {

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
 * @return {obj} Category object
 */
function sampleTextClassification(){
    const category = {
        categories: [
          { name: '/Business & Industrial', confidence: 0.5099999904632568 }
        ]
    }

    return category
}


