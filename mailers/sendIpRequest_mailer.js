const nodemailer = require('../config/nodemailer');
const User = require('../models/user');

function fetchStudentName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index-5);
    return name[0].toUpperCase() + name.substring(1,);
}

function fetchProffName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index);
    return name[0].toUpperCase() + name.substring(1,);
}

exports.sendIpRequest = async (proffEmail, studentEmail) => {
    console.log('inside new message mailer');
    var student = await User.findOne({email: studentEmail});
    var obj = [];
    obj.push({
      proffEmail: proffEmail,
      email : studentEmail,
      id: student._id
    });
    console.log(JSON.stringify(obj));
    // var url = `http://localhost:8000/btpApproved/${JSON.stringify(obj)}`;
    var url = 'http://localhost:8000/proff_home';
    let htmlString = `
    <div>
        <p>Hi ${fetchProffName(proffEmail)}!</p>
        <br>
        <p>You have received the following message requesting dues clearance for 
        IP/IS/UR from ${fetchStudentName(studentEmail)} 
        (email - ${studentEmail}).</p>
        <p>Click <a href=\`http://localhost:8000/proff_home\`>here</a> to approve the dues.</p>
        <br>
        <p>Thanks No-Dues!</p>
    </div>`
    console.log(htmlString);
    nodemailer.transporter.sendMail({
        from : 'no-dues@iiitd.ac.in',
        to : proffEmail,
        subject : 'No-Dues request for IP/IS/UR',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}