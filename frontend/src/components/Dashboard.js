import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../utils/api';
import './Dashboard.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const startDate = getStartDate(dateRange);
      const endDate = new Date().toISOString();

      const [statsRes, expensesRes] = await Promise.all([
        api.get('/expenses/stats', { params: { startDate, endDate } }),
        api.get('/expenses', { params: { startDate, endDate } }),
      ]);

      setStats(statsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range) => {
    const date = new Date();
    switch (range) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setMonth(date.getMonth() - 1);
    }
    return date.toISOString();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  const pieChartData = {
    labels: stats?.categoryStats.map((cat) => cat.name) || [],
    datasets: [
      {
        data: stats?.categoryStats.map((cat) => cat.total) || [],
        backgroundColor: stats?.categoryStats.map((cat) => cat.color) || [],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ₹${context.parsed.toFixed(2)}`;
          },
        },
      },
    },
  };

  const barChartData = {
    labels: stats?.categoryStats.map((cat) => cat.name) || [],
    datasets: [
      {
        label: 'Spending by Category',
        data: stats?.categoryStats.map((cat) => cat.total) || [],
        backgroundColor: stats?.categoryStats.map((cat) => cat.color) || [],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '₹' + value;
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-filter">
          <button
            className={`btn ${dateRange === 'week' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDateRange('week')}
          >
            Week
          </button>
          <button
            className={`btn ${dateRange === 'month' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDateRange('month')}
          >
            Month
          </button>
          <button
            className={`btn ${dateRange === 'year' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDateRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ef4444' }}>💸</div>
          <div className="stat-info">
            <h3>Total Spent</h3>
            <p className="stat-value">₹{stats?.totalSpent?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>✅</div>
          <div className="stat-info">
            <h3>You Are Owed</h3>
            <p className="stat-value green">₹{stats?.youAreOwed?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>⏳</div>
          <div className="stat-info">
            <h3>You Owe</h3>
            <p className="stat-value orange">₹{stats?.youOwe?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>💰</div>
          <div className="stat-info">
            <h3>Balance</h3>
            <p className={`stat-value ${stats?.balance >= 0 ? 'green' : 'red'}`}>
              ₹{stats?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h2>Spending by Category</h2>
          <div className="chart-container">
            {stats?.categoryStats?.length > 0 ? (
              <Pie data={pieChartData} options={pieChartOptions} />
            ) : (
              <p className="no-data">No expenses to display</p>
            )}
          </div>
        </div>

        <div className="card chart-card">
          <h2>Category Breakdown</h2>
          <div className="chart-container">
            {stats?.categoryStats?.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <p className="no-data">No expenses to display</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Expenses</h2>
        {expenses.length > 0 ? (
          <div className="expense-list">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense._id} className="expense-item">
                <div className="expense-icon" style={{ background: expense.category.color }}>
                  {expense.category.icon}
                </div>
                <div className="expense-details">
                  <h4>{expense.description}</h4>
                  <p className="expense-meta">
                    {expense.category.name} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="expense-amount">
                  ₹{expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No recent expenses</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
