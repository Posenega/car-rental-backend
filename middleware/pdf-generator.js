const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")
const handlebars = require("handlebars")

function generateRandom6DigitNumber() {
  return Math.floor(100000 + Math.random() * 900000)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

async function generatePDF(order) {
  const templatePath = path.join(
    __dirname,
    "templates",
    "invoice.html"
  )
  const templateHtml = fs.readFileSync(templatePath, "utf8")
  const template = handlebars.compile(templateHtml)

  const data = {
    createdAt: formatDate(order.createdAt?.$date || order.createdAt),
    fullName: order.fullName,
    email: order.email,
    mobileNumber: order.mobileNumber,
    age: order.age,
    pickupLocation: order.pickupLocation,
    dropoffLocation: order.dropoffLocation,
    startDate: formatDate(order.startDate?.$date || order.startDate),
    endDate: formatDate(order.endDate?.$date || order.endDate),
    pickupTime: order.pickupTime,
    fuelOptionType: order.fuelOption?.type,
    fuelOptionPrice: order.fuelOption?.price || 0,
    insuranceFull: order.selectedInsurance?.full || 0,
    insuranceTires: order.selectedInsurance?.tiresAndWindscreen || 0,
    insuranceDriver: order.selectedInsurance?.insuranceForDriver || 0,
    serviceChauffeur: order.selectedServices?.chauffeur || 0,
    serviceChild: order.selectedServices?.childSeat || 0,
    serviceSatellite:
      order.selectedServices?.satelliteNavigation || 0,
    serviceGPS: order.selectedServices?.gps || 0,
    totalPrice: order.totalPrice,
    paymentStatus: order.paymentStatus,
    carImageUrl:
      "../uploads/cars/toyotacorolla2022-removebg-preview.png",
  }
  console.log("Data for PDF:", data)

  const html = template(data)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: "networkidle0" })

  const outputDir = path.join(__dirname, "..", "uploads", "invoices")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const fileName = `${generateRandom6DigitNumber()}.pdf`
  const filePath = path.join(outputDir, fileName)

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  })

  await browser.close()

  return {
    filePath: `uploads/invoices/${fileName}`,
    fileName,
  }
}

module.exports = { generatePDF }
