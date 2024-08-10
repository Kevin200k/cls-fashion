const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

// const sendOTP = ({ email }) => {
//   const generatedOTP = generateOTP();


//   const message = `
//   <body>
//     <p>Hi ${user.name},</p>
//     <p>You have successfully registered your account. Please enter the code below to confirm your account.</p>
//     <h3>${generatedOTP}</h3>
//   </body>
// `;

//   const emailOptions = {
//     sender: 'CLS Fashion <addysupport@addysart.com>',
//     email: email,
//     subject: 'Registration Successful',
//     message: message,
//   }



// }

export default generateOTP