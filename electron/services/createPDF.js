const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

function createPDF (pdfPath, data) {
  const doc = new PDFDocument({
    size: 'A4'
  })

  const col1LeftPos = 70
  const colTop = 50
  const colWidth = 180
  const col2LeftPost = colWidth + col1LeftPos + 100

  // Add watermark here
  doc.image(path.join(__dirname, '../img/watermark-fotaka.jpg'), 0, 0, { width: 595 })

  doc
    .image(path.join(__dirname, '../img/logo-fotaka.jpg'), col1LeftPos, colTop, { width: 100, height: 40 })
    .fontSize(12)
    .text('PRINTLAB S.L CIB: B73722720', col2LeftPost, colTop)
    .text('C/Floridablanca 30 C.P 30167', col2LeftPost, null)
    .text('La Raya (Murcia)', col2LeftPost)

  doc
    .fontSize(12)
    .text(' ')
    .text(' ')
    .text(
      'CONTRATO/PRESUPUESTO PARA LA REALIZAZCIÓN DE UNA OBRA FOTOGRÁFICA Y/O AUDIOVISUAL DE UN REPORTAJE SOCIAL, ESTUDIO Y OTROS TRABAJOS RELACIONADOS CON LA IMAGEN',
      50
    )
    .text(' ')
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .fontSize(12)
    .text('Fecha del evento: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.event.date)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Iglesia: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.event.place)
    .text(' ')

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Cliente: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.client.name)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('DNI: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.client.dni)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Teléfono: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.client.phone)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Dirección: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.client.direction)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Nombre del niño/a: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.model.name)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Pack Seleccionado: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.pack)
    .text(' ')

  doc.rect(50, doc.y + 25, 450, 150).stroke()
  doc
    .fontSize(15)
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Presupuesto ', { align: 'center' })
    .font('Helvetica')

  const rectHeight = doc.y + 200

  doc.rect(50, rectHeight, 450, 100).stroke()
  doc
    .fontSize(10)
    .text('', 50)
    .text(data.notes, 70, doc.y + 50)

  doc
    .fontSize(15)
    .font('Helvetica-Bold')
    .text('Observaciones ', 50, rectHeight - 20, { align: 'center' })
    .font('Helvetica')

  doc
    .fontSize(10)
    .text('', 50)
    .text(data.notes, 70, doc.y + 25)

  doc
    .fontSize(10)
    .text('Ctra. de Alicante 49 C.P 30163', col1LeftPos, 730, { width: colWidth, align: 'center' })
    .text('Cobatillas (Murcia)', col1LeftPos, doc.y, { width: colWidth, align: 'center' })
    .text('Tel: 968864845', col1LeftPos, doc.y, { width: colWidth, align: 'center' })
    .text('C/Mayor, 67 C.P: 30820', col2LeftPost, 730, { align: 'center' })
    .text('Alcantarilla (Murcia)', col2LeftPost, doc.y, { align: 'center' })
    .text('Tel: 968801332', col2LeftPost, doc.y, { align: 'center' })

  // doc.addPage().fontSize(25).text('Tema legal', 100, 100)

  doc
    .pipe(
      fs.createWriteStream(path.join(pdfPath, data.model.name + '.pdf'))
    )
    .on('finish', () => {
    })

  doc.end()
}

module.exports = { createPDF }
