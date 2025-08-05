npm init -y
npm install mysql2


.env

pindahkan setting database ke .env
```MYSQL_USER='root'```

```npm install dotenv```

```
import dotenv from 'dotenv'
dotenv.config();
```

```process.env.MYSQL_USER```

install nodemon
npm install -D nodemon

tambahkan pada package.json
```
"scripts": {
    "dev": "npx nodemon app.js"
}
```