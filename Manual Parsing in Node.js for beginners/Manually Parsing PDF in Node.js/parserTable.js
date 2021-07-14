// Import dependencies
const fs = require("fs");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};
// Get all the filenames from the patients folder

// All of the parse patients
const jsonData = [];

(async () => {
  await new Promise(async (resolve, reject) => {
    pdfExtract.extract("patients_3/file_3.pdf", options, (err, data) => {
      // mang luu danh sach cac text duoc tra ve
      const pdfData = [];
      if (err) return console.log(err);
      // them cac text duoc tra ve vao 1 mang
      for (let index = 0; index < data.pages[0].content.length; ) {
        let str = ""; // luu text tren 1 dong hoac nhieu dong
        let count = 0; // la buoc nhay trong vong while o tren
        // neu text trong 1 o la mot dong thi count = 1, neu hon 1 dong
        // thi count = so dong
        const value = data.pages[0].content[index]; // du lieu mot dong duoc tra ve
        // kiem tra xem du lieu trong mot o mot dong hay nhieu dong
        for (
          let index_2 = index;
          index_2 < data.pages[0].content.length;
          index_2++
        ) {
          // vong lap duyet tu index -> vi tri cuoi cung
          // kiem tra xem du lieu nam tren nhieu dong hay khong bang vi tri x
          // neu text chi co mot dong thi them dong do vao str, sau do thoat khoi vong lap
          // neu text nam tren nhieu dong thi them dong ben duoi vao bien str, sau do cong count len 1
          if (value.x === data.pages[0].content[index_2].x) {
            str += data.pages[0].content[index_2].str;
            count++;
          } else {
            break; // neu sang o khac thi thoat khoi vong lap
          }
        }
        pdfData.push(str); // them str vao mang pdfData
        index += !count ? 1 : count; // buoc nhay
      }
      console.log(pdfData);
      // them thu lieu tu mang luu danh sach cac text vao mang luu json
      for (let index = 2; index < pdfData.length; index += 2) {
        // jsonData.push({
        //   name: pdfData[index],
        //   address: pdfData[index + 1],
        //   phone: pdfData[index + 2],
        //   birthday: pdfData[index + 3],
        //   emailAddress: pdfData[index + 4],
        //   bloodType: pdfData[index + 5],
        //   height: pdfData[index + 6],
        //   weight: pdfData[index + 7],
        // });
        jsonData.push({
          number: pdfData[index],
          content: pdfData[index + 1],
        });
      }
      resolve({ jsonData });
    });
  });
  // Save the extracted information to a json file
  fs.writeFileSync("patients_table.json", JSON.stringify(jsonData));
})();
