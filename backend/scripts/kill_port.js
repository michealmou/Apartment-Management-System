const net = require('net');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 5000;

console.log(`\n🔍 Checking for process using port ${PORT}...\n`);

// Check if port is in use
const server = net.createServer();

server.once('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use!`);
        
        try {
            console.log('\n🔪 Attempting to kill the process...\n');
            
            // On Windows
            if (process.platform === 'win32') {
                const output = execSync(`netstat -ano | findstr :${PORT}`).toString();
                console.log('Current processes on port ' + PORT + ':');
                console.log(output);
                
                const lines = output.trim().split('\n');
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    
                    if (pid && !isNaN(pid)) {
                        console.log(`\n⚔️  Killing process ${pid}...`);
                        try {
                            execSync(`taskkill /PID ${pid} /F`);
                            console.log(`✅ Successfully killed process ${pid}`);
                        } catch (e) {
                            console.log(`❌ Failed to kill process ${pid}: ${e.message}`);
                        }
                    }
                }
            } else {
                // On macOS/Linux
                const output = execSync(`lsof -i :${PORT}`).toString();
                console.log('Current processes on port ' + PORT + ':');
                console.log(output);
                
                const lines = output.trim().split('\n');
                const pidLine = lines[1];
                if (pidLine) {
                    const pid = pidLine.split(/\s+/)[1];
                    console.log(`\n⚔️  Killing process ${pid}...`);
                    try {
                        execSync(`kill -9 ${pid}`);
                        console.log(`✅ Successfully killed process ${pid}`);
                    } catch (e) {
                        console.log(`❌ Failed to kill process: ${e.message}`);
                    }
                }
            }
            
            console.log('\n✅ Port ' + PORT + ' should now be free!');
            console.log('Try starting the server again: npm start\n');
            
        } catch (err) {
            console.error('Error:', err.message);
            console.log('\nManual fix:');
            console.log('1. Open Task Manager (Ctrl+Shift+Esc)');
            console.log('2. Find any "node" processes');
            console.log('3. Right-click and select "End Task"');
            console.log('4. Then run: npm start');
        }
        
        process.exit(0);
    }
});

server.once('listening', () => {
    server.close();
    console.log(`✅ Port ${PORT} is available!`);
    console.log('\n🚀 Starting server...\n');
    require('../server.js');
});

server.listen(PORT);
