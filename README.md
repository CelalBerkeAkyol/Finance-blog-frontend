# 📝 Data Science & ML Blog Frontend

This project is a **minimal blog platform** created to share our knowledge in **Data Science** and **Machine Learning**. Since it supports the Markdown format, we can **easily integrate Python Notebooks**, **add images**, **categorize content**, and improve the user experience with a **Table of Contents**.

> **Note:** This project consists of **two components**:
>
> - **Frontend**: (This repo).
> - **Backend** **[Backend Repo](https://github.com/CelalBerkeAkyol/Finance-blog-backend)**

## Frontend Features

### **Reader (User Features)**

- ✅ **Minimal and Fast**: Provides a smooth reading experience with a simple, content-focused, and efficient design.
- ✅ **Categorization**: Blog posts are grouped by topics for a more structured layout.
- ✅ **Table of Contents**: Allows users to quickly navigate to the sections they need, saving time.
- ✅ **Advanced Search**: Enables users to search within blog content and find information instantly.
- ✅ **Skeleton Loading**: Displays a modern skeleton screen while loading the page for a better user experience.

### **Admin (Management Panel)**

- ✅ **Hidden Admin Login**: Provides extra security with a private admin access section.
- ✅ **Management Dashboard**: A centralized panel for managing, editing, and analyzing blog content.
- ✅ **Custom Admin Navigation**: A special menu for admins to speed up the post creation and editing process.
- ✅ **Markdown Support**: Easily write content in Markdown format and import from Jupyter Notebook or ChatGPT Canvas.
- ✅ **Easy Blog Writing**: A minimalist interface allows quick and practical blog post creation.
- ✅ **Image Management**: Supports uploading multiple images at once and easily adding them in Markdown format.

### **Upcoming Features**

- ✅ **Email Newsletter**: Users can subscribe to receive notifications about new content.
- ✅ **Like & Comment System**: Enables users to provide feedback and increase engagement.
- ✅ **Financial Support**: Allows users to support the platform via donations if they find the content valuable.
- ✅ **Social Media Sharing**: Easily share content on various platforms.
- ✅ **Data Collection & Visualization**: Blog performance data will be collected and visualized in the admin panel.
- ✅ **Machine Learning for Data Analysis**: User interactions will be analyzed to develop better content strategies.

## 🛠 Technologies Used

- **Frontend:** React.js
- **State Management:** Redux, Context API
- **Styling:** NextUI, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## 📎 Project Structure

```
📂 src
 ┓ 📂 app            # Redux or Context API management
 ┓ 📂 assets         # Images, icons, CSS files
 ┓ 📂 components     # Reusable components
 ┓ 📂 pages          # Page components (Home, Blog Details, Categories, etc.)
 ┓ 📂 utils          # Helper functions (Markdown parser, date formatting, etc.)
```

## Environment Variables

The project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# API URL'leri
VITE_API_URL=http://localhost:3000/api

# Loglama ayarları
VITE_ENABLE_LOGGING=true
VITE_LOG_LEVEL=debug

# Uygulama ayarları
VITE_APP_NAME=Cassandra
VITE_APP_VERSION=1.0.0
```

For production, create a `.env.production` file with appropriate values:

```
# API URL'leri - Üretim ortamında gerçek API URL'nizi kullanın
VITE_API_URL=https://api.cassandra.com/api

# Loglama ayarları - Üretim ortamında loglama kapalı
VITE_ENABLE_LOGGING=false
VITE_LOG_LEVEL=error
```

### Log Levels

The application supports different log levels:

- `debug`: All logs (debug, info, warning, error)
- `info`: Info, warning, and error logs
- `warning`: Warning and error logs
- `error`: Only error logs

## Screenshots

![Blogs Page](./screenshots/Screenshot%202025-02-15%20at%2018.57.02.png)  
![Blog Post](./screenshots/Screenshot%202025-02-15%20at%2018.57.22.png)  
![Blogs List ](./screenshots/Screenshot%202025-02-15%20at%2018.58.26.png)  
![Edit Blog Post ](./screenshots/Screenshot%202025-02-15%20at%2018.59.37.png)

> **Note**: You can add your screenshots here.

## Installation & Running the Project

Clone the project and run it locally.

```bash
git clone https://github.com/CelalBerkeAkyol/finance-blog-frontend/
cd finance-blog-frontend
npm install
npm start
```

## 📝 License

This project is distributed under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)** license. This license prohibits **commercial use** and **derivative works**. For more details, refer to the [LICENSE](LICENSE) file.

## 👨‍💻 Contributing

If you want to contribute to this project, please create an **Issue** before opening a **Pull Request**.

```bash
git checkout -b feature/new-feature
git commit -m "Added a new feature"
git push origin feature/new-feature
```

## **📩 Contact**

**Email:** [celalberke@cassandra.com.tr](mailto:celalberke@cassandra.com.tr)  
**Github:** [Github](https://github.com/CelalBerkeAkyol)  
**LinkedIn:** [LinkedIn](https://www.linkedin.com/in/celal-berke-akyol-389a3a216/)

---

### **🔗 Additional Links**

- 📌 **[Backend Repo](https://github.com/CelalBerkeAkyol/Finance-blog-backend)**
- 📌 **[API Swagger Docs](#)**

---

Feel free to reach out for any feedback or suggestions! 🚀
