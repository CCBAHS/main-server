require("dotenv").config();

const resetPasswordHTML = (OTP) => {
    return `
    <html>
        <head></head>
        <body style='font-size=15px;'>
            <p>
                Hello,<br>
            </p>
            <p>
                Welcome to <strong>Blockchain Tele-Health Services</strong>, <br>
                Your OTP to reset your password is <strong>${OTP}</strong>.<br>
            </p>
            <p>
                Warm Regards, <br>
                Customer Care <br>
                Blockchain Tele-Health Services
            </p>
            <p>
                <hr>
                <strong>
                    This is a system generated mail. Please do not reply to this email id. <br>If you have a query or need any clarification you may:<br>
                    Email us at <a href='mailto:${process.env.MAILER_ID}'style='text-decoration:none;'>${process.env.MAILER_ID}</a>
                </strong>
                <hr>
            </p>
        </body>
    </html>`;
}

const welcomeTextHTML = ({ firstName, middleName, lastName }, userName) => {
    return `
    <html>
        <head></head>
        <body style='font-size=15px;'>
            <p>
                Hello ${firstName + " " + middleName + " " + lastName},<br>
            </p>
            <p>
                Welcome to <strong>Blockchain Tele-Health Services</strong>, <br>
                We thank you for choosing our services.<br>
                Your username is <strong>${userName}</strong>.<br>
            </p>
            <p>
                Warm Regards, <br>
                Customer Care <br>
                Blockchain Tele-Health Services
            </p>
            <p>
                <hr>
                <strong>
                    This is a system generated mail. Please do not reply to this email id. <br>If you have a query or need any clarification you may:<br>
                    Email us at <a href='mailto:${process.env.MAILER_ID}'style='text-decoration:none;'>${process.env.MAILER_ID}</a>
                </strong>
                <hr>
            </p>
        </body>
    </html>`;
};

const appointmentBookedHTMLText = ({firstName, middleName, lastName}, tokenID) => {
    return `
    <html>
        <head></head>
        <body style='font-size=15px;'>
            <p>
                Hello ${firstName + " " + middleName + " " + lastName},<br>
            </p>
            <p>
                Welcome to <strong>Blockchain Tele-Health Services</strong>, <br>
                We thank you for choosing our services.<br>
                Your appointment has been successfully booked. <br>
                Your tokenID is ${tokenID}. Your appointment will be approved soon and we will notify you.<br>
            </p>
            <p>
                Warm Regards, <br>
                Customer Care <br>
                Blockchain Tele-Health Services
            </p>
            <p>
                <hr>
                <strong>
                    This is a system generated mail. Please do not reply to this email id. <br>If you have a query or need any clarification you may:<br>
                    Email us at <a href='mailto:${process.env.MAILER_ID}'style='text-decoration:none;'>${process.env.MAILER_ID}</a>
                </strong>
                <hr>
            </p>
        </body>
    </html>`;
};

const appointmentApprovedHTMLText = ({firstName, middleName, lastName}, tokenID) => {
    return `
    <html>
        <head></head>
        <body style='font-size=15px;'>
            <p>
                Hello ${firstName + " " + middleName + " " + lastName},<br>
            </p>
            <p>
                Welcome to <strong>Blockchain Tele-Health Services</strong>, <br>
                We thank you for choosing our services.<br>
                Your appointment with tokenID ${tokenID} has been approved. <br>
                Please kindly visit your doctor within 24 hours of your booked slot.
            </p>
            <p>
                Warm Regards, <br>
                Customer Care <br>
                Blockchain Tele-Health Services
            </p>
            <p>
                <hr>
                <strong>
                    This is a system generated mail. Please do not reply to this email id. <br>If you have a query or need any clarification you may:<br>
                    Email us at <a href='mailto:${process.env.MAILER_ID}'style='text-decoration:none;'>${process.env.MAILER_ID}</a>
                </strong>
                <hr>
            </p>
        </body>
    </html>`;
};

const appointmentClosedHTMLText = ({firstName, middleName, lastName}, tokenID) => {
    return `
    <html>
        <head></head>
        <body style='font-size=15px;'>
            <p>
                Hello ${firstName + " " + middleName + " " + lastName},<br>
            </p>
            <p>
                Welcome to <strong>Blockchain Tele-Health Services</strong>, <br>
                We thank you for choosing our services.<br>
                Your appointment with tokenID ${tokenID} has been closed. <br>
                We hope our services were liked by you.<br>
            </p>
            <p>
                Warm Regards, <br>
                Customer Care <br>
                Blockchain Tele-Health Services
            </p>
            <p>
                <hr>
                <strong>
                    This is a system generated mail. Please do not reply to this email id. <br>If you have a query or need any clarification you may:<br>
                    Email us at <a href='mailto:${process.env.MAILER_ID}'style='text-decoration:none;'>${process.env.MAILER_ID}</a>
                </strong>
                <hr>
            </p>
        </body>
    </html>`;
};
module.exports = { resetPasswordHTML, welcomeTextHTML, appointmentBookedHTMLText, appointmentApprovedHTMLText, appointmentClosedHTMLText };