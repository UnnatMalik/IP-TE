# 💰 Expense Tracker - MERN Stack

A full-stack expense tracking application with Splitwise-like features built using MongoDB, Express, React, and Node.js.

## Features

- 🔐 **User Authentication** - Register and login with JWT tokens
- 💸 **Expense Management** - Add, view, edit, and delete expenses
- 📊 **Visual Analytics** - Pie charts and bar graphs for spending analysis
- 👥 **Group Management** - Create groups and add members
- 💰 **Split Expenses** - Split bills equally or with custom amounts
- 🔍 **Filters** - Filter expenses by category, date, and group
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 💳 **Settlement** - Track who owes whom and settle up payments

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React.js
- React Router for navigation
- Chart.js for data visualization
- Axios for API calls
- Context API for state management

## Prerequisites

Before running this application, make sure you have:
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm start
```
The React app will run on `http://localhost:3000`

## Default Categories

The application comes with pre-seeded categories:
- 🍔 Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- 💡 Bills & Utilities
- 🏥 Healthcare
- ✈️ Travel
- 📚 Education
- 📁 Other

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `PUT /api/expenses/:id/settle` - Settle split payment
- `DELETE /api/expenses/:id` - Delete expense

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get single group
- `POST /api/groups` - Create new group
- `PUT /api/groups/:id/members` - Add member to group
- `DELETE /api/groups/:id` - Delete group

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/:id` - Delete category

### Users
- `GET /api/users` - Search users
- `GET /api/users/:id` - Get user by ID

## Features Walkthrough

### 1. Dashboard
- View total spending, amounts owed, and balance
- Visual charts showing spending by category
- Recent expenses list
- Filter by week, month, or year

### 2. Expenses
- Add new expenses with description, amount, category, and date
- Split expenses among group members
- Choose split type: Personal, Equal split
- Filter expenses by category, date range, and group
- Settle up payments

### 3. Groups
- Create groups for splitting expenses
- Add members by searching email or name
- View all group members
- Manage group expenses

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Group.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   ├── groups.js
│   │   ├── categories.js
│   │   └── users.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Navbar.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Expenses.js
│   │   │   └── Groups.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── README.md
```

## Screenshots

### Dashboard
Shows spending analytics with pie and bar charts, balance summary, and recent expenses.

### Expenses
Add and manage expenses with filtering options and split payment features.

### Groups
Create groups and manage members for splitting expenses.

## Future Enhancements

- [ ] Email notifications for expense splits
- [ ] Receipt upload functionality
- [ ] Export expenses to CSV/PDF
- [ ] Multiple currency support
- [ ] Recurring expenses
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Activity feed
- [ ] Comments on expenses

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.

## Acknowledgments

- Inspired by Splitwise
- Chart.js for beautiful visualizations
- MongoDB for flexible data storage
- React for amazing UI library

---

Made with ❤️ using MERN Stack
