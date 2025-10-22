module.exports = {
  apps: [{
    name: 'resume-rewriter',
    script: 'server-production.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Restart policy
    min_uptime: '10s',
    max_restarts: 10,
    // Advanced features
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    // Health monitoring
    health_check_grace_period: 3000,
    // Log rotation
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
