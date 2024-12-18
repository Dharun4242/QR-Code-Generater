import inquirer from "inquirer";
import qrcode from "qrcode-terminal";
import qr from "qr-image";
import fs from "fs";

inquirer
  .prompt([
    {
      message: "Enter your UPI ID (e.g., user@upi): ",
      name: "upiID",
    },
    {
      message: "Enter the payee name: ",
      name: "payeeName",
    },
    {
      message: "Enter the amount (optional): ",
      name: "amount",
      default: ""
    },
    {
      message: "Enter a transaction note (optional): ",
      name: "transactionNote",
      default: ""
    },
  ])
  .then((answers) => {
    // Construct the UPI payment URL
    const upiUrl = `upi://pay?pa=${answers.upiID}&pn=${encodeURIComponent(answers.payeeName)}&am=${answers.amount}&cu=INR&tn=${encodeURIComponent(answers.transactionNote)}`;

    // Display the QR code in the terminal
    qrcode.generate(upiUrl, { small: true });

    // Save the QR code as an image
    const qr_svg = qr.image(upiUrl);
    qr_svg.pipe(fs.createWriteStream("upi_qr_code.png"));

    // Save the UPI URL to a text file
    fs.writeFile("UPI_URL.txt", upiUrl, (err) => {
      if (err) throw err;
      console.log("The UPI QR code image and URL file have been saved!");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.error("Prompt couldn't be rendered in the current environment.");
    } else {
      console.error("An error occurred:", error);
    }
  });
