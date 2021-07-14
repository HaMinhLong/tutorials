// Import dependencies
const fs = require("fs");
const PDFParser = require("pdf2json");
const PDFExtract = require("pdf.js-extract").PDFExtract;
// Get all the filenames from the patients folder
const files = fs.readdirSync("patients_2");

// All of the parse patients
const jsonData = [];

// Make a IIFE so we can run asynchronous code
(async () => {
  // Await all of the patients to be passed
  // For each file in the patients folder
  await Promise.all(
    files.map(async (file) => {
      // Set up the pdf parser
      let pdfParser = new PDFParser(this, 1);

      // Load the pdf document
      pdfParser.loadPDF(`patients_2/${file}`);
      // Parsed the patient
      await new Promise(async (resolve, reject) => {
        // On data ready
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          // The raw PDF data in text form
          const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
          // console.log(pdfParser.getRawTextContent().replace(/\r\n/g, " "));

          const pdfDatas = raw.split("Câu ");

          console.log(pdfDatas);
          // Return the parsed data
          for (let index = 1; index < pdfDatas.length; index++) {
            jsonData.push({
              number: `${pdfDatas[index].split(": ")[0]}`,
              content: `${pdfDatas[index].split(": ")[1].split("?")[0]}?`,
            });
          }
          resolve({ jsonData });
        });
      });
      // Save the extracted information to a json file
      fs.writeFileSync("patients.json", JSON.stringify(jsonData));
    })
  );
})();
