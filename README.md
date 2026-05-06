# Library Admin Dashboard

A modern, responsive library management system built with React, Vite, and Tailwind CSS. This application provides a comprehensive interface for managing library books, members, and transactions.

## 🚀 Features

### 📚 Book Management

- View all library books
- Add new books to the collection
- Edit book details
- Delete books from inventory
- Search and filter books

### 👥 Member Management

- Manage library members
- View member profiles and borrowing history
- Add new members
- Update member information

### 🔄 Transaction Management

- Track book borrow/return transactions
- View transaction history
- Manage due dates and returns
- Filter transactions by status

### 🎨 User Interface

- Modern, responsive design
- Dark/light theme support
- Mobile-friendly layout
- Smooth animations and transitions
- Toast notifications for user feedback

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4
- **Build Tool**: Vite 8.0.10
- **Styling**: Tailwind CSS 4.2.2
- **Routing**: React Router DOM 7.14.1
- **Forms**: React Hook Form 7.72.1
- **Validation**: Zod 4.3.6
- **HTTP Client**: Axios 1.15.0
- **Notifications**: React Hot Toast 2.6.0
- **UI Components**: Flowbite 4.0.1
- **Icons**: Font Awesome 7.2.0

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YB122/admin-library-react.git
cd admin-library-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
```

### 4. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## � Deployment

### Vercel (Recommended)

#### Automatic Deployment

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Vercel will automatically detect the framework (Vite + React)
3. Set the environment variable `VITE_API_URL` in Vercel dashboard
4. Deploy with one click

#### Manual Deployment

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel --prod
```

#### Environment Variables

In Vercel dashboard, add:

- `VITE_API_URL` - Your backend API URL

### Other Platforms

The application can also be deployed on:

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## �📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Your backend API URL

### API Integration

The application is configured to work with a REST API. Make sure your API includes the following endpoints:

- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/members` - Get all members
- `GET /api/transactions` - Get all transactions
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

## 🏗️ Project Structure

```
src/
├── component/           # React components
│   ├── AuthLayout/     # Authentication layout
│   ├── BlankLayout/    # Main dashboard layout
│   ├── Login/          # Login component
│   ├── Register/       # Registration component
│   ├── Overview/       # Dashboard overview
│   └── Transactions/   # Transaction management
├── contexts/           # React contexts
├── App.jsx            # Main App component
└── main.jsx           # Application entry point
```

## 🎯 Key Features

### Authentication

- User registration and login
- JWT token-based authentication
- Protected routes
- Automatic logout on token expiration

### Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized for both desktop and mobile

### Data Management

- Real-time data updates
- Efficient data fetching
- Error handling and loading states
- Form validation with user feedback

## 🔗 Related Projects & Links

### 📚 Library Management System

- **Backend API**: https://github.com/YB122/Library
- **Admin Dashboard**: https://github.com/YB122/admin-library-react
- **Admin Dashboard Demo**: https://library-alex.vercel.app/
- **Alex Library Frontend**: https://github.com/YB122/Alex-Library
- **Alex Library Demo**: https://alex-library-next.vercel.app/

### 🚀 Quick Links

- **Live Demo**: [Admin Dashboard](https://library-alex.vercel.app/)
- **Source Code**: [Backend](https://github.com/YB122/Library) | [Frontend](https://github.com/YB122/admin-library-react)
- **Alex Library**: [Code](https://github.com/YB122/Alex-Library) | [Demo](https://alex-library-next.vercel.app/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/YB122/admin-library-react/issues) page
2. Create a new issue with detailed information
3. Include screenshots if applicable

## 🔄 Updates

- **Version 1.0.0** - Initial release with core features
- **Version 1.1.0** - Added mobile responsiveness
- **Version 1.2.0** - Enhanced UI/UX and performance optimizations

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
