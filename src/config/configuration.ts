export default () => ({
  port: parseInt(String(process.env.PORT), 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(String(process.env.DB_PORT), 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER || '',
    pwd: process.env.DB_PWD || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expired: process.env.JWT_EXPIRED
  },
  defaultUser: {
    email: process.env.ADMIN_ACCOUNT,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  },
  email: {
    provider: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_PROVIDER,
        pass: process.env.EMAIL_PASSWORD_PROVIDER
      }
    },
    config: {
      subject: 'e-Solution',
      from: 'it.sopheakchhin@gmail.com',
      to: 'sopheakchhin777@gmail.com',
      html: '<b>Hello world.</b>'
    }
  },
  sms_provider: {
    url: 'https://www.experttexting.com/ExptRestApi/sms/json/Message/Send',
    username: 'meanmean',
    api_secret: 'hs1qwt3a1a0b58e',
    api_key: 'lto1xgkdfc08697',
    from: '85567248999'
  }
});
