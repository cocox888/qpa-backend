const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const Reports = require('../../models/Report');

function generateHeader(doc, data) {
  const logoPath = path.join(__dirname, '../../assets/logo.png');
  doc
    .image(logoPath, 50, 60, { width: 100 })
    .fillColor('darkgreen')
    .fontSize(20)
    .text(data.revenue, 160, 57)
    .fontSize(20, 700)
    .font('Helvetica-Bold')
    .text('TASKS REPORT')
    .moveDown();
}

// function generateFooter(doc, data) {
//   doc.fontSize(10).text(`Total this ${data.revenue}:`, 150, 600, {
//     align: 'left',
//     width: 500
//   });
// }

function generateCustomerInformation(doc, invoice) {
  const customerInformationTop = 110;

  // generateHr(doc, 185);

  doc
    .fontSize(10)
    .fillColor('darkgreen')
    .font('Helvetica-Bold')
    .text('Project:', 50, customerInformationTop)
    .text('Date:', 50, customerInformationTop + 15)
    .text('Month:', 50, customerInformationTop + 30)
    .text('Booked Hours:', 50, customerInformationTop + 45)
    .text('Hours Used So Far:', 50, customerInformationTop + 60)
    .text('Package Type:', 50, customerInformationTop + 75)
    .font('Helvetica')
    .text(invoice.project, 150, customerInformationTop)
    .text(
      `${invoice.startDate} ~ ${invoice.endDate}`,
      150,
      customerInformationTop + 15
    )
    .text(invoice.month, 150, customerInformationTop + 30)
    .text(
      invoice.bookedHours
        ? `${Math.floor(invoice.bookedHours)} hours`
        : '',
      150,
      customerInformationTop + 45
    )
    .text(
      `${Math.floor(invoice.hourUsed / 60)} hours ${
        invoice.hourUsed % 60
      } minutes`,
      150,
      customerInformationTop + 60
    )
    .text(invoice.package_type.toUpperCase(), 150, customerInformationTop + 75)
    .moveDown();
}

function generateTableRow(doc, y, c1, c2, c3, c4) {
  doc
    .fontSize(10)
    .font('Helvetica')
    .text(c1, 90, y)
    .text(c2, 180, y)
    .text(c3, 340, y, { width: 90, align: 'right' })
    .text(c4, 450, y, { width: 90, align: 'right' });
}

function generateTableHeader(doc, y, c1, c2, c3, c4) {
  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .text(c1, 90, y)
    .text(c2, 180, y)
    .text(c3, 340, y, { width: 90, align: 'right' })
    .text(c4, 450, y, { width: 90, align: 'right' });
}

function generateInvoiceTable(doc, invoice) {
  let i,
    invoiceTableTop = 245;

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      `${
        item.createdAt.getMonth() + 1
      } / ${item.createdAt.getDate()} / ${item.createdAt.getFullYear()}`,
      item.title,
      `${Math.floor(item.estimated_time / 60)} hours ${
        item.estimated_time % 60
      } minutes`,
      item.assignedTaskUser.map((user) => user.full_name).join(', ')
    );
  }
}

function generateHR(doc, y) {
  doc
    .strokeColor('darkgreen') // Set the line color to dark green
    .lineWidth(1) // Set the line width
    .moveTo(80, y) // Start the line at x=50 and y (the provided y position)
    .lineTo(550, y) // End the line at x=550 and y (horizontal line with length from 50 to 550)
    .stroke(); // Draw the line
}
function generateSideNav(doc, invoice) {
  doc
    .fillColor('darkgreen') // Set the fill color to dark green
    .rect(
      0,
      228,
      80,
      invoice.items.length < 20 ? 650 : 20 * invoice.items.length
    ) // Create a rectangle from x=0 to x=100 and y=230 to y=500
    .fill(); // Fill the rectangle with the dark green color
}

const createInvoice = async (invoice, filePath) => {
  const dir = path.join(__dirname, '../../reports');
  const fullFilePath = path.join(__dirname, `../../reports/${filePath}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      size: 'A4',
      layout: 'portrait'
    });

    const stream = fs.createWriteStream(fullFilePath);
    doc.pipe(stream);

    generateHeader(doc, invoice);
    generateCustomerInformation(doc, invoice);

    generateHR(doc, 228);
    generateSideNav(doc, invoice);

    generateTableHeader(
      doc,
      230,
      'Date',
      'Task Description',
      'Time Spent',
      'VA'
    );

    generateInvoiceTable(doc, invoice);
    // generateFooter(doc, invoice);

    doc.end();

    stream.on('finish', () => resolve(fullFilePath));
    stream.on('error', (err) => reject(err));

    // const report = await Reports.create({project_type})
  });
};

const createReport = async (
  project_id,
  project_name,
  project_type,
  client_name,
  client_id,
  start_date,
  end_date,
  file_name
) => {
  return await Reports.create({
    project_type,
    project_name,
    client_name,
    project_id,
    client_id,
    start_date,
    end_date,
    file_name
  });
};

const getAllReport = async () => {
  return await Reports.findAll();
};
const getAllReportsByClientId = async (req) => {
  return await Reports.findAll({ where: { client_id: req } });
};

module.exports = {
  createInvoice,
  createReport,
  getAllReport,
  getAllReportsByClientId
};
