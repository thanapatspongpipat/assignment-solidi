# Getting Started

Follow these steps to set up and run the project:

## 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone [<repository-url>](https://github.com/thanapatspongpipat/assignment-solidi.git)
cd [<repository-directory>](assignment-solidi)
```

## 2. Install Dependencies

```bash
npm install
#or
yarn install
```

## 3. Configure Environment Variables

Create a .env file in the root directory of the project and add the necessary environment variables
You may need to refer to a sample .env.example file

In your .env file, set the AUTH_SECRET parameter. You can generate a secure value for AUTH_SECRET using the following command:

```bash
openssl rand -base64 32
```

This command will generate a random base64-encoded string that you can use as your secret key. Make sure to copy and paste this generated string into your .env file.


## 4. Run the Application

Start the development server:

```bash
npm run dev 
```

## 5. Login or Register to use website 

```bash
Mockup user 

email: admin@admin.com
password: 1234
```







