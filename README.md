<h1>Smart Farming: Aquaculture and Smart Irrigation System</h1>
    
<h2>Introduction to Modules</h2>
    <p>The system integrates two major components: Aquaculture Management and Smart Irrigation System. These modules help to optimize agricultural processes and ensure low wastage of resources.</p>
    
<h3>Aquaculture System</h3>
    <p>The Aquaculture System employs advanced sensors for continuous monitoring and regulation of water parameters. The sensors include:</p>
    <ul>
        <li><strong>pH Sensor</strong>: Monitors water acidity or alkalinity to maintain optimal conditions.</li>
        <li><strong>Oxygen Sensor</strong>: Assesses oxygen levels to ensure adequate oxygenation for aquatic life.</li>
        <li><strong>Ammonia Sensor</strong>: Tracks ammonia levels, alerting and correcting toxic concentrations.</li>
        <li><strong>Turbidity Sensor</strong>: Detects suspended particles and activates neutralizer pumps as needed.</li>
        <li><strong>Temperature Sensor</strong>: Regulates water temperature, maintaining optimal thermal conditions.</li>
    </ul>
    <p>Data flows from these sensors to an edge server for analysis, initiating corrective actions when thresholds are crossed. Blockchain technology records actions for transparency and accountability.</p>
    
<h3>Smart Irrigation System</h3>
  
    <p>The Smart Irrigation System uses advanced sensor technology to optimize water use. The key sensors include:</p>
    <ul>
        <li><strong>Soil Moisture Sensor</strong>: Triggers irrigation when moisture levels fall below set thresholds.</li>
        <li><strong>pH Sensor</strong>: Maintains soil pH for optimal nutrient absorption.</li>
        <li><strong>Humidity Sensor</strong>: Monitors atmospheric conditions affecting water needs.</li>
        <li><strong>Temperature Sensor</strong>: Adjusts irrigation schedules based on temperature variations.</li>
    </ul>
    <p>Automated valves and pumps ensure precise water distribution. A user interface provides real-time insights, allowing farmers to monitor and control irrigation with data-driven decisions.</p>
    
<h2>Benefits for Farmers</h2>
    <p>The system enhances agricultural efficiency by providing precise control over aquaculture and irrigation processes.</p>
    <ul>
        <li>Minimized water wastage through dynamic irrigation control.</li>
        <li>Improved crop yield with optimal hydration and soil conditions.</li>
        <li>Enhanced aquaculture productivity by maintaining a healthy aquatic environment.</li>
        <li>Reduced environmental impact and conservation of resources.</li>
    </ul>
    
<h2>Tools and Technologies Used</h2>
    <ul>
        <li><strong>Hyperledger Fabric</strong>: Ensures secure and transparent data storage for aquaculture management.</li>
        <li><strong>Contiki-NG</strong>: Used for IoT simulations and networking protocols.</li>
        <li><strong>Docker</strong>: Containerizes the blockchain and server environments.</li>
        <li><strong>Python</strong>: Powers the edge server for data processing.</li>
        <li><strong>Node.js</strong>: Handles user interface operations.</li>
        <li><strong>MSP430</strong>: Interfaces with sensors for real-time monitoring.</li>
    </ul>
    
<h1>Project Setup Instructions</h1>
  <p> Visit this link for Video Solution:  <a href="https://www.linkedin.com/posts/daksh-patel-nitw_agritech-blockchain-automation-activity-7216868350893645824-pVTB?utm_source=share&utm_medium=member_desktop">Click here</a></p>
<h2>Initial Setup</h2>
    <ul>
        <li>Move <b>contiki-2.7</b>, <b>fabric-samples</b>, and <b>server.py</b> into the Ubuntu WSL.</li>
        <li>Copy the 2 files.</li>
        <li>Copy the <b>Project folder</b> on your host machine somewhere or on wsl.
          <ul>
          <li>Download Node higher than 14 and run <code>npm install </code></li>
          <li> Also run this in "Project/dashboard" <code> npm install </code></li>
          </ul>
        </li>
        <li>Download and install the following on your WSL machine:
            <ul>
                <li>Go</li>
                <li>NVM</li>
                <li>Java v14.21.3 using NVM</li>
                <li>Ant</li>
                <li>MSP430</li>
            </ul>
        </li>
    </ul>

<h2>Run Hyperledger (Tab 1)</h2>
    <ol>
        <li>Open Docker Desktop.</li>
        <li>Go to settings and check <i>"Use the WSL 2 based engine (Windows Home can only run the WSL 2 backend)"</i>.</li>
        <li>If already configured, open Docker.</li>
        <li>Open Ubuntu WSL and run the following commands:
            <pre>
cd fabric-samples/Aqua
./startFabric.sh
cd javascript
            </pre>
        </li>
    </ol>

<h2>Run Contiki-NG (Tab 2)</h2>
    <ol>
        <li>Open a new WSL terminal and run:
            <pre>
cd contiki-2.7/tools/cooja
ant run
            </pre>
        </li>
        <li>Open the <i>iot_project.csc</i> file already present.</li>
        <li>Open a new WSL terminal and run:
            <pre>
cd contiki-2.7/examples/ipv6/rpl-border-router
make connect-router-cooja
            </pre>
        </li>
        <li>Click <i>start</i> in the Cooja Simulator.</li>
    </ol>

<h2>Run Edge Server (Tab 3)</h2>
    <ol>
        <li>Open a new WSL terminal and run:
            <pre>python3 server.py</pre>
        </li>
    </ol>

<h2>Run Hyperledger Explorer (Tab 4)</h2>
    <ol>
        <li>Open a new WSL terminal and run:
            <pre>
cd fabric-samples/Explorer
./startExplorer.sh
            </pre>
        </li>
        <li>Open a browser and go to <a href="http://localhost:8080/#/">localhost:8080/#/</a>.</li>
        <li>Login using:
            <ul>
                <li>Username: <b>exploreradmin</b></li>
                <li>Password: <b>exploreradminpw</b></li>
            </ul>
        </li>
        <li>Go to Tab 1 and run:
            <pre>
nvm use
node app.js
            </pre>
        </li>
        <li>Open a web browser and visit: <a href="http://localhost:3051/enrollAdmin">http://localhost:3051/enrollAdmin</a></li>
    </ol>

<h2>Run UI</h2>
    <ol>
        <li>Open the Project folder in VSCode.</li>
        <li>Open a terminal and run:
            <pre>node app.js</pre>
        </li>
        <li>Open a new terminal and run:
            <pre>
cd .\dashboard
npm start
            </pre>
        </li>
    </ol>

<h2>Shutting Down</h2>
    <ol>
        <li>First, close all VSCode terminals for the Project folder.</li>
        <li>In Explorer, run:
            <pre>./networkDown.sh</pre>
        </li>
        <li>In fabric-samples, also run:
            <pre>./networkDown.sh</pre>
        </li>
    </ol>

