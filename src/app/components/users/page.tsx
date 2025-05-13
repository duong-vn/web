'use client';

import React from 'react';
import styles from './users.module.css';

interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
}

const UsersPage = () => {
  const users: User[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      avatar: '👩‍💻',
      status: 'online',
      lastActive: 'Active now'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'UX Designer',
      avatar: '👨‍🎨',
      status: 'away',
      lastActive: 'Last seen 5m ago'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Backend Developer',
      avatar: '👩‍💻',
      status: 'offline',
      lastActive: 'Last seen 2h ago'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Product Manager',
      avatar: '👨‍💼',
      status: 'online',
      lastActive: 'Active now'
    }
  ];

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return styles.statusOnline;
      case 'away':
        return styles.statusAway;
      case 'offline':
        return styles.statusOffline;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Team Members</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{users.length}</span>
            <span className={styles.statLabel}>Total Members</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {users.filter(u => u.status === 'online').length}
            </span>
            <span className={styles.statLabel}>Online Now</span>
          </div>
        </div>
      </div>

      <div className={styles.userGrid}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userHeader}>
              <div className={styles.avatar}>{user.avatar}</div>
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>{user.name}</h2>
                <p className={styles.userRole}>{user.role}</p>
              </div>
              <div className={`${styles.status} ${getStatusColor(user.status)}`} />
            </div>
            <div className={styles.userFooter}>
              <span className={styles.lastActive}>{user.lastActive}</span>
              <button className={styles.messageButton}>Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage; 