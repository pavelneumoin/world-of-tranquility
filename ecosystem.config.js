module.exports = {
    apps: [{
        name: 'tranquility-server',
        script: 'server.py',
        interpreter: 'python3',
        env: {
            PORT: 5001
        }
    }]
};
