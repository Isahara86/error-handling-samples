1. Install node js 16.x https://nodejs.org/en/
2. Create file .env in the root folder ( save folder where index.json )
3. Add to .env file next rows
   3.1 HOROSHOP_PRODUCTS_URL=<your horoshop url example: https://bujobox.com.ua/api/catalog/export/>
   3.2 HOROSHOP_AUTH_URL=<your horoshop login example: https://bujobox.com.ua/api/auth/>
   3.3 HOROSHOP_LOGIN=<your horoshop login>
   3.3 HOROSHOP_PASS=<your horoshop password>
   3.3 AWS_ACCESS_KEY_ID=<your aws key id>
   3.3 AWS_SECRET_ACCESS_KEY=<your aws key>
4. Open console ( macOS terminal or windows cmd)
5. Navigate in console to the root folder ( save folder where index.json ). cd <path to script folder>
6. Install packages - execute 'npm ci' in console. This step should be performed once.
7. From now whenever you need you can fetch the latest data with console command - execute 'npm start' in console.
8. Result file will be uploaded to S3 link will appear in console
