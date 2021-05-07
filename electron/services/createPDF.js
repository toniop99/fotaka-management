const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

function createPDF (pdfPath, data) {
  let currentDate = new Date().toLocaleDateString('es-ES')
  currentDate = currentDate.split('/').join('-')

  const doc = new PDFDocument({
    size: 'A4'
  })

  const col1LeftPos = 70
  const colTop = 50
  const colWidth = 180
  const col2LeftPost = colWidth + col1LeftPos + 100

  doc.image(path.join(__dirname, '../img/watermark-fotaka.jpg'), 0, 0, { width: 595 })

  doc
    .image(path.join(__dirname, '../img/logo-fotaka.jpg'), col1LeftPos, colTop, { width: 100, height: 40 })
    .fontSize(12)
    .text('PRINTLAB S.L CIB: B73722720', col2LeftPost, colTop)
    .text('C/Floridablanca 30 C.P 30167', col2LeftPost, null)
    .text('La Raya (Murcia)', col2LeftPost)
    .font('Helvetica-Bold')
    .text(`Fecha: ${currentDate}`, col2LeftPost)

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
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Cliente: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.general.client.name)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('DNI: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.general.client.dni)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Teléfono: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.general.client.phone)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Nombre del niño/a: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.general.model.name)
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Pack Seleccionado: ', { lineBreak: false })
    .font('Helvetica')
    .text(data.general.pack)
    .text(' ')

  if (data.event) {
    doc
      .font('Helvetica-Bold')
      .text('', 50)
      .fontSize(11)
      .text('Fecha del evento: ', { lineBreak: false })
      .font('Helvetica')
      .text(data.event.date)
      .font('Helvetica-Bold')
      .moveUp(1)
      .text('Hora del evento: ', 250, null, { lineBreak: false })
      .font('Helvetica')
      .text(data.event.time, 350, null)
      .text(' ')

    doc
      .font('Helvetica-Bold')
      .text('', 50)
      .text('Lugar: ', { lineBreak: false })
      .font('Helvetica')
      .text(data.event.place)
      .font('Helvetica-Bold')
      .moveUp(1)
      .text('Dirección: ', 250, null, { lineBreak: false })
      .font('Helvetica')
      .text(data.event.direction, 320)
      .text(' ')
  }

  if (data.studio) {
    doc
      .font('Helvetica-Bold')
      .text('', 50)
      .fontSize(11)
      .text('Fecha del estudio: ', { lineBreak: false })
      .font('Helvetica')
      .text(data.studio.date)
      .font('Helvetica-Bold')
      .moveUp(1)
      .text('Hora del estudio: ', 250, null, { lineBreak: false })
      .font('Helvetica')
      .text(data.studio.time, 350)
      .text(' ')
  }

  doc.rect(50, doc.y + 25, 450, 150).stroke()
  doc
    .fontSize(15)
    .font('Helvetica-Bold')
    .text('', 50)
    .text('Presupuesto ', { align: 'center' })
    .font('Helvetica')

  const rectHeight = doc.y + 200

  // doc.rect(50, rectHeight, 450, 100).stroke()
  doc
    .fontSize(10)
    // .text('', 50)
    .text(data.general.notes, 65, doc.y + 20)

  // doc
  //   .fontSize(15)
  //   .font('Helvetica-Bold')
  //   .text('Observaciones ', 50, rectHeight - 20, { align: 'center' })
  //   .font('Helvetica')

  // doc
  //   .fontSize(10)
  //   .text('', 50)
  //   .text(data.notes, 70, doc.y + 25)

  doc
    .fontSize(10)
    .text('Ctra. de Alicante 49 C.P 30163', col1LeftPos, 730, { width: colWidth, align: 'center' })
    .text('Cobatillas (Murcia)', col1LeftPos, doc.y, { width: colWidth, align: 'center' })
    .text('Tel: 968864845', col1LeftPos, doc.y, { width: colWidth, align: 'center' })
    .text('C/Mayor, 67 C.P: 30820', col2LeftPost, 730, { align: 'center' })
    .text('Alcantarilla (Murcia)', col2LeftPost, doc.y, { align: 'center' })
    .text('Tel: 968801332', col2LeftPost, doc.y, { align: 'center' })

  doc.addPage().fontSize(12).text('CLÁUSULAS', 60, null)

  doc.fontSize(10).font('Helvetica-Bold').text(
    'Primera:\n', 60, null
  ).font('Helvetica').text(
    'El/los cliente/s, autoriza/n a Print Lab S.L a tomarle/s imágenes por cualquier medio técnico para\nla realización de la obra fotográfica y/o audiovisual objeto de este contrato.'
  )

  doc.font('Helvetica-Bold').text(
    'Segunda:\n', 60, null
  ).font('Helvetica').text(
    'Según establece la ley de propiedad intelectual, todos los derechos y copyright de las obras fotográficas y/o audiovisuales objeto de este contrato, son propiedad de Print Lab y el uso de las mismas por parte de el/los cliente/s es privativo, no pudiendo este/os comercialiazrlas, reproducirlas o transformarlas por cualquier medio, cederlas a terceros, publicarlas, exhibirlas públicamente, etc... sin autorizazción expresa y fehaciente por escrito de Print Lab.'
  )

  doc.font('Helvetica-Bold').text(
    'Tercera:\n', 60, null
  ).font('Helvetica').text(
    'El cliente autoriza a Print Lab al uso, exhibición de sus obras por cualquier medio de difusión (exhibición en tiendas, escaparates, internet, etc.). En caso contrario el cliente manifestará de su puño y letra que es contrario a esta cláusula junto a su firma.'
  )

  doc.font('Helvetica-Bold').text(
    'Cuarta:\n', 60, null
  ).font('Helvetica').text(
    'Son propiedad de Print Lab todos los materiales necesarios para la realización de las obras fotográficas y/o audiovisuales.'
  )

  doc.font('Helvetica-Bold').text(
    'Quinta:\n', 60, null
  ).font('Helvetica').text(
    'Cuando el desarrollo del trabajo contratado precise obtener permisos o autoriaziones de determinados lugares donde se tenga que realizar, asi como del audio, música o imágenes facilitadas por el cliente, corresponderá al/los cliente/s gestionar la obtención de la autoriación previa para su uso o utilización, así como del abono de las tasas o cánones si los hubiese.'
  ).text(' ')

  doc.fontSize(12).text('PLAZOS DE ENTREGA Y PENALIZACIONES')

  doc.font('Helvetica-Bold').fontSize(10).text(
    'Sexta:\n', 60, null
  ).font('Helvetica').text(
    'El plazo de entrega del trabajo realizazdo objeto de este contrato será de 6 meses, a contar desde la fecha de selección de las imágenes a incorporar al mismo por parte de el/los cliente/s.'
  )

  doc.font('Helvetica-Bold').text(
    'Séptima:\n', 60, null
  ).font('Helvetica').text(
    'Print Lab, se obliga a la terminación del trabajo objeto de este contrato en el plazzo señalado de seis meses, a contar desde la fecha de selección de las imágenes a incorporar al mismo por parte de el/los cliente/s. En caso de que no se terminara en el plazo señalado, Print Lab indemnizará a el/los cliente/s con la cantidad de 3 € diarios en concepto de penalización.'
  )

  doc.font('Helvetica-Bold').text(
    'Octava:\n', 60, null
  ).font('Helvetica').text(
    'Se entenderá por fecha de terminación del trabajo, el día en el que Print Lab lo comunique a el/los cliente/s por medio de CARTA, LLAMADA TELEFONICA, SMS, E-MAIL, etc...; esta comunicación quedará registrada en el archivo de Print Lab.'
  )

  doc.font('Helvetica-Bold').text(
    'Novena:\n', 60, null
  ).font('Helvetica').text(
    'El/Los cliente/s dispondrá/n de 10 días a partir de la comunicación de que el trabajo está terminado, para la recogida del mismo y liquidación del importe pendiente si lo hubiese. En cualquier caso si la cancelación se produjera con 3 meses o menos de antelación, el/los cliente/s indemnizará/n a Print Lab con el 50% del presupuesto reflejado en este contrato.'
  )

  doc.font('Helvetica-Bold').text(
    'Decimotercera:\n', 60, null
  ).font('Helvetica').text(
    'Si el trabajo objeto de este contrato, se suspendiera o retrasara por causa de fuerza mayor, se fijará una nueva fecha para la realización del mismo, fecha esta, que estará supeditada a que Print Lab pueda realizarlo. Si no fuese así, y el/los cliente/s no aceptara/n cambiarla, se aplicará la cláusula duodécima.'
  )

  doc.font('Helvetica-Bold').text(
    'Decimocuarta:\n', 60, null
  ).font('Helvetica').text(
    'Para cualquier reclamación objeto de este contrato, que exceda la forma amistosa, ambas partes se someterán a los juzgados y Tribunales de la Región de Murcia'
  ).text(' ').text(' ')

  doc.fontSize(11).text('Por lo que de conformidad por ambas partes, lo firman por').text(' ')
  doc.fontSize(10).text('Murcia, a')

  doc
    .fontSize(10)
    .text('El/los cliente/s', col1LeftPos, 730, { width: colWidth, align: 'center' })
    .text(' ')
    .text('Fdo.: ', col1LeftPos, doc.y, { width: colWidth, align: 'left' })
    .text('Print Lab S.L', col2LeftPost, 730, { align: 'center' })
    .text(' ')
    .text('Fdo.: ', col2LeftPost, doc.y, { align: 'left' })

  doc
    .pipe(
      fs.createWriteStream(path.join(pdfPath, currentDate + '-' + data.general.model.name + '.pdf'))
    )
    .on('finish', () => {
    })

  doc.end()
}
// createPDF('C:\\Users\\dioxi\\Downloads', {
//   general: {
//     client: { name: 'Antonio', dni: '48636817M', phone: '968341502' },
//     model: { name: 'Antonio' },
//     pack: 'asd',
//     notes: 'Paquete to flama que lo flipas de wapo\nameisin que lo matas',
//     prize: '123'
//   },
//   event: { date: '25-05-2021', time: '18:00', place: 'La Raya', direction: 'Nuestra señora de la encarnación' },
//   studio: { date: '18-05-2021', time: '22:15' }
// })
module.exports = { createPDF }
