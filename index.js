const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const swaggerDocument = require('./swagger-output.json');

require('./models');

// const authenticateToken = require('./src/middleware/authMiddleware'); // Import authentication middleware
const auth = require('./src/router/authRouter');
const vaRouter = require('./src/router/vaRouter');
const clientRouter = require('./src/router/clientRouter');
const adminRouter = require('./src/router/adminRouter');
const managerRouter = require('./src/router/managerRouter');
const uploadRouter = require('./src/router/uploadRouter');
const { handleVerify } = require('./src/middleware/verifyToken');
const roleVerify = require('./src/middleware/roleVerify');

require('./utils/storageSetup.js');
require('dotenv').config();

const app = express();
const path = require('path');
const PORT = process.env.PORT;

// const whiteList = ['https://mysite.com','http://localhost:4000', 'http://localhost:3000'];
// const corsOptions = {
// 	origin: (origin,callback) => {
// 		if (whiteList.indexOf(origin) !== -1 || !origin) {
// 			callback(null,true)
// 		}else {
// 			callback(new Error("CORS BLOCKED THIS REQUEST!!"));
// 		}
// 	},
// 	OptionsSucessStatus: 200
// }

// app.use(cors(corsOptions));

const cron = require('node-cron');
const resetProjectTimes = require('./src/services/ProjectTimeLineService'); // Import function

// Run daily at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily project time reset...');
  await resetProjectTimes();
});

// Run weekly at midnight on Monday (00:00 Monday)
cron.schedule('0 0 * * 1', async () => {
  console.log('Running weekly project time reset...');
  await resetProjectTimes();
});

// Run monthly at midnight on the 1st day of the month (00:00)
cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly project time reset...');
  await resetProjectTimes();
});

app.use(
  cors({
    credentials: true
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/example', (req, res) => {
  res.send('Hello, World!');
});

app.use(auth);
app.use('/', uploadRouter);

app.use(
  '/reports',
  // roleVerify('admin'),
  express.static(path.join(__dirname, 'reports'))
);

//Authenticated User Access
app.use(handleVerify);

//Router For Admin
app.use('/admin', roleVerify('admin'), adminRouter);

//Router For Project Manager.
app.use('/manager', roleVerify('manager'), managerRouter);

//Router For Virtual Assistant.
app.use('/member', roleVerify('member'), vaRouter);

//Router For Client.
app.use('/client', roleVerify('client'), clientRouter);

app.listen(PORT, () => {
  //console.log("The server is running at localhost:" + PORT);
});
