const mysql = require('mysql2/promise');

const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'edumate_user',
      password: 'EduMate2024!',
      database: 'edumate_ai'
    });

    console.log('✅ Database connected successfully!');
    
    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Users in database: ${rows[0].count}`);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

testConnection();