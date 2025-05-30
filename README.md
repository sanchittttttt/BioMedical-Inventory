# Biomedical Inventory Management System

A modern web-based inventory management system designed specifically for biomedical facilities and laboratories. This system helps track medical equipment, supplies, and consumables, ensuring efficient inventory control and proper stock management for critical biomedical resources.

## Features

- 🔐 **Secure Authentication**
  - User registration and login
  - JWT-based authentication
  - Protected routes and API endpoints

- 🔬 **Biomedical Inventory Management**
  - Track medical equipment and supplies
  - Monitor consumables and reagents
  - Set expiry dates for time-sensitive items
  - Update stock levels
  - Delete obsolete items

- ⚠️ **Low Stock Alerts**
  - Automatic alerts for critical supplies (≤10 units)
  - Visual indicators in the dashboard
  - Email notifications for critical stock levels

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Clean and intuitive UI
  - Easy navigation

## Tech Stack

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Chart.js for data visualization

- **Backend**:
  - Node.js
  - Express.js
  - MySQL
  - JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/biomed-inventory-system.git
   cd biomed-inventory-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Set up the database:
   - Create a MySQL database
   - Import the database schema from `database/schema.sql`

5. Start the server:
   ```bash
   npm start
   ```

6. Access the application:
   - Open your browser and navigate to `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Inventory
- `GET /api/inventory/items` - Get all inventory items
- `POST /api/inventory/items` - Add new item
- `PUT /api/inventory/items/:id` - Update item quantity
- `DELETE /api/inventory/items/:item_name` - Delete item

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Chart.js for data visualization
- Express.js team for the amazing framework
- MySQL team for the database system

## Contact

Your Name - sanchitdubbewar03@gmail.com

Project Link: [[https://github.com/sanchit/biomed-inventory-system](https://github.com/sanchittttttt/BioMedical-Inventory)]
