# Exam Next JS

**Exam Next JS** is a fully functional e-commerce project built with **Next.js**, allowing users to:

Browse products and categories
View product details
Add products to a shopping cart
Edit cart quantities and remove items
Checkout with address selection and payment method
View order summary and history

## Installation

1. Clone the repository

git clone https://github.com/AngelikaKarlak-Sztenderewicz/exam_next_shop

2. Install dependencies:

npm install

3. Set up environment variables in .env:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/exam_shop?schema=public"
NEXTAUTH_SECRET="randomsecretkey123"
NEXTAUTH_URL="http://localhost:3000"

4. Start PostgreSQL (if using Docker):

docker-compose up -d

5. Run migrations and seed the database:

npx prisma migrate dev
npm run seed

6. Start the development server:

npm run dev

**The app will be available at http://localhost:3000.**

### Usage

1. Open the application in your browser.

2. Register or log in to your account.

3. Navigate the **main menu**:

4. **Home page** – browse featured products and categories.

5. **Product list** – filter by category or price, sort by newest/cheapest/most expensive.

6. **Product details** – see product info, add to cart, view category.

7. **Cart** – edit quantities, remove items, see subtotal and total.

8. **Checkout** – select address, add notes, choose payment method, click Pay now to finalize the order.

9. **Profile** – view user info and order history, logout.

10. The **cart** is synced with the backend, so stock is updated automatically.

11. Clicking **Pay now** saves the order in the database and redirects to the order summary page.
