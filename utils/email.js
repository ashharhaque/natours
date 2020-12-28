const nodemailer=require("nodemailer");
const htmlToText=require("html-to-text");
const pug=require("pug");



module.exports=class Email{
  constructor(user,url)
  {
  this.to=user.email;
  this.firstname=user.name.split(" ")[0];
  this.url=url;
  this.from=`ashharulhaque${process.env.EMAIL_FROM}`
  }
  newTransport()
  {
    if(process.env.NODE_ENV==="production")
    {
      sendgrid

      return nodemailer.createTransport({
        host:process.env.PEPIPOST_HOST,
        port:process.env.PEPIPOST_PORT,
        auth:{
          user:process.env.PEPIPOST_USERNAME,
          pass:process.env.PEPIPOST_PASSWORD
        }
      })
      
        
     
    }  
    return   nodemailer.createTransport({
      host:process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user:process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });      
  }         
  
  async send(template,subject){
    //render html based on a pug template
    const html= pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
      firstname:this.firstname,
      url:this.url,
      subject
    })
    //define email options
    const mailOptions=({
      from:this.from,
      to:this.to,
      subject,
      html,
      text:htmlToText.fromString(html)

  });     
  //create a transport and send email
  await this.newTransport().sendMail(mailOptions);
}
  async sendWelcome()
  {
    await this.send("welcome","welcome to the natours family")
  } 
  async sendPasswordReset(){
    await this.send("passwordReset","password reset token is sent valid only for 10 mins");
  }
          
}        
