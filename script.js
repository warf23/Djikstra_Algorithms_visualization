// Graph data structure
let nodes = [];
let links = [];
let selectedNode = null;
let dragLine = null;
let pathHistory = [];

// Color palette for nodes
const nodeColors = {
    default: '#6366f1',  // Indigo
    selected: '#4f46e5', // Darker Indigo
    path: '#22c55e',     // Green
    hover: '#818cf8'     // Light Indigo
};

// Initialize D3 visualization
const width = document.getElementById('graphContainer').clientWidth;
const height = document.getElementById('graphContainer').clientHeight;

const svg = d3.select('#graphContainer')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Add zoom behavior
const g = svg.append('g');
const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
        g.attr('transform', event.transform);
    });

svg.call(zoom);

// Optimize force simulation parameters
const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-200).distanceMax(300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30))
    .velocityDecay(0.4)
    .alphaTarget(0)
    .alphaMin(0.001)
    .alphaDecay(0.02)
    .on('tick', ticked);

// Initialize graph elements
let link = g.append('g').selectAll('.link');
let node = g.append('g').selectAll('.node');
let linkLabels = g.append('g').selectAll('.link-label');
let nodeLabels = g.append('g').selectAll('.node-label');

// Update graph visualization
function updateGraph() {
    // Update links with transition
    link = link.data(links, d => `${d.source.id}-${d.target.id}`);
    link.exit().transition()
        .duration(500)
        .attr('stroke-opacity', 0)
        .remove();
    const linkEnter = link.enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke-opacity', 0)
        .on('click', handleLinkClick);
    link = linkEnter.merge(link);
    link.transition()
        .duration(500)
        .attr('stroke-opacity', 0.6);

    // Update link labels with transition
    linkLabels = linkLabels.data(links, d => `${d.source.id}-${d.target.id}`);
    linkLabels.exit().transition()
        .duration(500)
        .attr('opacity', 0)
        .remove();
    const linkLabelsEnter = linkLabels.enter()
        .append('text')
        .attr('class', 'link-label')
        .attr('opacity', 0)
        .text(d => d.weight);
    linkLabels = linkLabelsEnter.merge(linkLabels);
    linkLabels.transition()
        .duration(500)
        .attr('opacity', 1);

    // Update nodes with transition
    node = node.data(nodes, d => d.id);
    node.exit().transition()
        .duration(500)
        .attr('r', 0)
        .remove();
    const nodeEnter = node.enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 0)
        .attr('fill', '#6366f1')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('click', handleNodeClick);
    node = nodeEnter.merge(node);
    node.transition()
        .duration(500)
        .attr('r', 15);

    // Update node labels with transition
    nodeLabels = nodeLabels.data(nodes, d => d.id);
    nodeLabels.exit().transition()
        .duration(500)
        .attr('opacity', 0)
        .remove();
    const nodeLabelsEnter = nodeLabels.enter()
        .append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('opacity', 0)
        .text(d => d.id);
    nodeLabels = nodeLabelsEnter.merge(nodeLabels);
    nodeLabels.transition()
        .duration(500)
        .attr('opacity', 1);

    // Update simulation
    simulation.nodes(nodes);
    simulation.force('link').links(links);
    simulation.alpha(1).restart();
}

// Tick function for force layout
function ticked() {
    link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

    node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    nodeLabels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
}

// Drag functions
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Enhanced node click handler with toolbar
function handleNodeClick(event, d) {
    // Remove any existing toolbars
    d3.selectAll('.node-toolbar').remove();
    
    const toolbar = d3.select('body')
        .append('div')
        .attr('class', 'node-toolbar')
        .style('position', 'absolute')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .style('background', 'white')
        .style('padding', '12px')
        .style('border-radius', '8px')
        .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')
        .style('border', '1px solid #e5e7eb')
        .style('z-index', 1000)
        .html(`
            <div class="font-bold mb-3">Node: ${d.id}</div>
            <div class="mb-3">
                <label class="block text-sm mb-1">Name:</label>
                <input type="text" id="nodeName" value="${d.id}" 
                       class="border rounded px-2 py-1 w-full">
            </div>
            <div class="mb-3">
                <label class="block text-sm mb-1">Color:</label>
                <div class="flex gap-2">
                    <div class="color-option" style="background: #6366f1" data-color="#6366f1"></div>
                    <div class="color-option" style="background: #22c55e" data-color="#22c55e"></div>
                    <div class="color-option" style="background: #ef4444" data-color="#ef4444"></div>
                    <div class="color-option" style="background: #f59e0b" data-color="#f59e0b"></div>
                    <div class="color-option" style="background: #06b6d4" data-color="#06b6d4"></div>
                </div>
            </div>
            <div class="flex justify-between">
                <button id="updateNode" class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded">Update</button>
                <button id="deleteNode" class="bg-red-100 text-red-600 px-3 py-1 rounded">Delete</button>
            </div>
        `);

    // Style color options
    toolbar.selectAll('.color-option')
        .style('width', '24px')
        .style('height', '24px')
        .style('border-radius', '4px')
        .style('cursor', 'pointer')
        .style('border', '2px solid transparent')
        .on('click', function() {
            const color = this.getAttribute('data-color');
            d3.select(event.currentTarget).style('fill', color);
            // Update color in node data
            d.color = color;
        });

    // Update node handler
    toolbar.select('#updateNode')
        .on('click', () => {
            const newName = toolbar.select('#nodeName').property('value');
            if (newName && newName !== d.id) {
                const oldId = d.id;
                d.id = newName;
                // Update related edges
                links.forEach(link => {
                    if (link.source.id === oldId) link.source.id = newName;
                    if (link.target.id === oldId) link.target.id = newName;
                });
                updateGraph();
                updateNodeSelects();
            }
            toolbar.remove();
        });

    // Delete node handler
    toolbar.select('#deleteNode')
        .on('click', () => {
            nodes = nodes.filter(n => n.id !== d.id);
            links = links.filter(l => l.source.id !== d.id && l.target.id !== d.id);
            updateGraph();
            updateNodeSelects();
            toolbar.remove();
        });

    // Close toolbar when clicking outside
    d3.select('body').on('click.toolbar', function(evt) {
        if (evt.target.closest('.node-toolbar')) return;
        toolbar.remove();
        d3.select('body').on('click.toolbar', null);
    });
}

// Link click handler
function handleLinkClick(event, d) {
    // Remove any existing popups
    d3.selectAll('.popup').remove();
    
    const popup = d3.select('body')
        .append('div')
        .attr('class', 'popup')
        .style('position', 'absolute')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .style('opacity', 0)
        .html(`
            <div class="font-bold mb-2">Edge: ${d.source.id} → ${d.target.id}</div>
            <input type="number" id="newWeight" value="${d.weight}" 
                   class="border rounded px-2 py-1 w-full mb-2">
            <div class="flex justify-between">
                <button id="updateWeight" class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded">Update</button>
                <button id="deleteEdge" class="bg-red-100 text-red-600 px-3 py-1 rounded">Delete</button>
            </div>
        `);

    // Fade in the popup
    popup.transition()
        .duration(200)
        .style('opacity', 1);

    // Update weight handler
    popup.select('#updateWeight')
        .on('click', () => {
            const newWeight = parseInt(popup.select('#newWeight').property('value'));
            if (!isNaN(newWeight)) {
                d.weight = newWeight;
                updateGraph();
            }
            popup.remove();
        });

    // Delete edge handler
    popup.select('#deleteEdge')
        .on('click', () => {
            links = links.filter(l => l !== d);
            updateGraph();
            popup.remove();
        });

    // Close popup when clicking outside
    d3.select('body')
        .on('click.popup', function(evt) {
            if (evt.target.closest('.popup')) return;
            popup.remove();
            d3.select('body').on('click.popup', null);
        });
}

// Add node
function addNode(id) {
    if (!nodes.find(n => n.id === id)) {
        nodes.push({ id });
        updateGraph();
        updateNodeSelects();
    }
}

// Add edge
function addEdge(source, target, weight) {
    if (!links.find(l => l.source.id === source && l.target.id === target)) {
        links.push({ source, target, weight });
        updateGraph();
    }
}

// Update node select elements
function updateNodeSelects() {
    const selects = ['sourceNode', 'targetNode', 'startNode', 'endNode'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '';
        nodes.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.id;
            select.appendChild(option);
        });
    });
}

// Dijkstra's Algorithm
function dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
        unvisited.add(node.id);
    });
    distances[start] = 0;

    while (unvisited.size > 0) {
        let current = null;
        let minDistance = Infinity;
        
        // Find unvisited node with minimum distance
        for (let nodeId of unvisited) {
            if (distances[nodeId] < minDistance) {
                minDistance = distances[nodeId];
                current = nodeId;
            }
        }

        if (current === null) break;
        if (current === end) break;

        unvisited.delete(current);

        // Update distances to neighbors
        const neighbors = links.filter(l => 
            l.source.id === current || l.target.id === current
        );

        for (let edge of neighbors) {
            const neighbor = edge.source.id === current ? edge.target.id : edge.source.id;
            const distance = distances[current] + edge.weight;

            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previous[neighbor] = current;
            }
        }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    return path;
}

// Event Listeners
document.getElementById('addNode').addEventListener('click', () => {
    const nodeName = document.getElementById('nodeName').value.trim();
    if (nodeName) {
        addNode(nodeName);
        document.getElementById('nodeName').value = '';
    }
});

document.getElementById('addEdge').addEventListener('click', () => {
    const source = document.getElementById('sourceNode').value;
    const target = document.getElementById('targetNode').value;
    const weight = parseInt(document.getElementById('weight').value) || 1;
    addEdge(source, target, weight);
});

document.getElementById('findPath').addEventListener('click', () => {
    const start = document.getElementById('startNode').value;
    const end = document.getElementById('endNode').value;
    const path = dijkstra(start, end);
    visualizeShortestPath(path);
});

document.getElementById('clearGraph').addEventListener('click', () => {
    nodes = [];
    links = [];
    updateGraph();
    updateNodeSelects();
});

document.getElementById('centerView').addEventListener('click', () => {
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
});

document.getElementById('exportGraph').addEventListener('click', () => {
    const graphData = {
        nodes: nodes.map(n => ({ id: n.id })),
        links: links.map(l => ({
            source: l.source.id,
            target: l.target.id,
            weight: l.weight
        }))
    };
    
    const dataStr = "data:text/json;charset=utf-8," + 
        encodeURIComponent(JSON.stringify(graphData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "graph.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

// Add function to create sample complex graph
function createSampleGraph() {
    // Clear existing graph
    nodes = [];
    links = [];

    // Create nodes
    const cities = ['Paris', 'London', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 
                   'Brussels', 'Vienna', 'Prague', 'Copenhagen'];
    
    cities.forEach(city => {
        addNode(city);
    });

    // Create edges with realistic distances (approximate flight distances in km)
    const routes = [
        { source: 'Paris', target: 'London', weight: 344 },
        { source: 'Paris', target: 'Berlin', weight: 878 },
        { source: 'Paris', target: 'Madrid', weight: 1054 },
        { source: 'Paris', target: 'Brussels', weight: 264 },
        { source: 'London', target: 'Amsterdam', weight: 357 },
        { source: 'London', target: 'Berlin', weight: 932 },
        { source: 'Berlin', target: 'Prague', weight: 280 },
        { source: 'Berlin', target: 'Copenhagen', weight: 354 },
        { source: 'Berlin', target: 'Vienna', weight: 524 },
        { source: 'Rome', target: 'Vienna', weight: 765 },
        { source: 'Rome', target: 'Madrid', weight: 1364 },
        { source: 'Madrid', target: 'Brussels', weight: 1315 },
        { source: 'Amsterdam', target: 'Copenhagen', weight: 621 },
        { source: 'Amsterdam', target: 'Brussels', weight: 173 },
        { source: 'Vienna', target: 'Prague', weight: 253 },
        { source: 'Prague', target: 'Copenhagen', weight: 634 }
    ];

    routes.forEach(route => {
        addEdge(route.source, route.target, route.weight);
    });

    // Update the visualization
    updateGraph();
    updateNodeSelects();

    // Center the view
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
}

// Add button event listener for sample graph
document.addEventListener('DOMContentLoaded', () => {
    const sampleButton = document.createElement('button');
    sampleButton.textContent = 'Load Sample Graph';
    sampleButton.className = 'px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200 mr-4';
    sampleButton.onclick = createSampleGraph;
    
    const controlsDiv = document.querySelector('#clearGraph').parentElement;
    controlsDiv.insertBefore(sampleButton, document.querySelector('#clearGraph'));
});

// Enhanced path visualization
function visualizeShortestPath(path) {
    // Reset previous highlights
    d3.selectAll('.link').classed('highlighted', false);
    d3.selectAll('.node')
        .style('fill', d => d.color || nodeColors.default)
        .classed('highlighted', false);
    
    // Create results panel
    const resultsPanel = d3.select('body')
        .append('div')
        .attr('class', 'results-panel')
        .style('position', 'fixed')
        .style('left', '20px')
        .style('top', '20px')
        .style('background', 'white')
        .style('padding', '20px')
        .style('border-radius', '12px')
        .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')
        .style('max-width', '300px')
        .style('opacity', 0)
        .html(`
            <div class="text-xl font-bold mb-4">Shortest Path Results</div>
            <div class="space-y-3">
                <div class="p-3 bg-green-50 rounded-lg">
                    <div class="font-medium text-green-800">Path Found:</div>
                    <div class="text-green-600">${path.join(' → ')}</div>
                </div>
                <div class="p-3 bg-blue-50 rounded-lg">
                    <div class="font-medium text-blue-800">Total Distance:</div>
                    <div class="text-blue-600">${calculatePathDistance(path)}</div>
                </div>
            </div>
        `);

    // Animate results panel
    resultsPanel.transition()
        .duration(500)
        .style('opacity', 1);

    // Highlight path with animation
    let delay = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const pathLink = links.find(l => 
            (l.source.id === path[i] && l.target.id === path[i + 1]) ||
            (l.source.id === path[i + 1] && l.target.id === path[i])
        );
        
        if (pathLink) {
            // Highlight edge
            setTimeout(() => {
                d3.selectAll('.link')
                    .filter(d => 
                        (d.source.id === pathLink.source.id && d.target.id === pathLink.target.id) ||
                        (d.source.id === pathLink.target.id && d.target.id === pathLink.source.id)
                    )
                    .classed('highlighted', true)
                    .style('stroke', nodeColors.path);

                // Highlight nodes
                d3.selectAll('.node')
                    .filter(d => d.id === path[i] || d.id === path[i + 1])
                    .style('fill', nodeColors.path)
                    .classed('highlighted', true);
            }, delay);
        }
        delay += 500;
    }

    // Remove results after delay
    setTimeout(() => {
        resultsPanel.transition()
            .duration(500)
            .style('opacity', 0)
            .remove();
    }, 10000);

    // Add to history
    const start = document.getElementById('startNode').value;
    const end = document.getElementById('endNode').value;
    const distance = calculatePathDistance(path);
    addToHistory(start, end, path, distance);
}

// Calculate total path distance
function calculatePathDistance(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const edge = links.find(l => 
            (l.source.id === path[i] && l.target.id === path[i + 1]) ||
            (l.source.id === path[i + 1] && l.target.id === path[i])
        );
        if (edge) {
            distance += edge.weight;
        }
    }
    return distance;
}

// Language configuration
const translations = {
    en: {
        title: 'Graph Controls',
        nodeManagement: 'Node Management',
        enterNodeName: 'Enter node name',
        addNode: 'Add Node',
        edgeManagement: 'Edge Management',
        source: 'Source',
        target: 'Target',
        weight: 'Weight',
        addEdge: 'Add Edge',
        findPath: 'Find Shortest Path',
        start: 'Start',
        destination: 'Destination',
        findPathBtn: 'Find Path',
        clear: 'Clear',
        center: 'Center',
        export: 'Export',
        pathHistory: 'Path History',
        clearHistory: 'Clear History',
        exportPDF: 'Export PDF',
        timestamp: 'Timestamp',
        from: 'From',
        to: 'To',
        path: 'Path',
        distance: 'Distance',
        actions: 'Actions',
        role: 'élève ingénieur à L\'ENSAM de CASABLANCA spécialisé en management des systèmes électriques intelligents',
        distanceUnit: '',
        generatedOn: 'Generated on',
        shortestPathFound: 'Shortest Path Found',
        totalDistance: 'Total Distance',
        noHistoryYet: 'No path history yet',
        confirmClearHistory: 'Are you sure you want to clear the history?',
        replayPath: 'Replay this path',
        deletePath: 'Delete this path',
        pathFound: 'Path found',
        historyExported: 'History exported successfully',
        historyCleared: 'History cleared successfully',
        kmAbbr: 'km'
    },
    fr: {
        title: 'Contrôles du Graphe',
        nodeManagement: 'Gestion des Nœuds',
        enterNodeName: 'Entrez le nom du nœud',
        addNode: 'Ajouter un Nœud',
        edgeManagement: 'Gestion des Arêtes',
        source: 'Source',
        target: 'Destination',
        weight: 'Poids',
        addEdge: 'Ajouter une Arête',
        findPath: 'Trouver le Plus Court Chemin',
        start: 'Départ',
        destination: 'Arrivée',
        findPathBtn: 'Trouver le Chemin',
        clear: 'Effacer',
        center: 'Centrer',
        export: 'Exporter',
        pathHistory: 'Historique des Chemins',
        clearHistory: 'Effacer l\'historique',
        exportPDF: 'Exporter en PDF',
        timestamp: 'Horodatage',
        from: 'De',
        to: 'À',
        path: 'Chemin',
        distance: 'Distance',
        actions: 'Actions',
        role: 'élève ingénieur à L\'ENSAM de CASABLANCA spécialisé en management des systèmes électriques intelligents',
        distanceUnit: '',
        generatedOn: 'Généré le',
        shortestPathFound: 'Plus Court Chemin Trouvé',
        totalDistance: 'Distance Totale',
        noHistoryYet: 'Aucun historique de chemin',
        confirmClearHistory: 'Voulez-vous vraiment effacer l\'historique ?',
        replayPath: 'Rejouer ce chemin',
        deletePath: 'Supprimer ce chemin',
        pathFound: 'Chemin trouvé',
        historyExported: 'Historique exporté avec succès',
        historyCleared: 'Historique effacé avec succès',
        kmAbbr: 'km'
    }
};

let currentLang = localStorage.getItem('preferredLanguage') || 'en';

// Function to update UI text
function updateUILanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
    
    // Update dynamic content
    updateHistoryTable();
}

// Function to change language
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    updateUILanguage();
}

// Modify your existing functions to use translations
function formatTimestamp(date) {
    return new Intl.DateTimeFormat(currentLang === 'fr' ? 'fr-FR' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Function to add path to history
function addToHistory(start, end, path, distance) {
    const historyEntry = {
        id: Date.now(),
        timestamp: new Date(),
        start,
        end,
        path,
        distance
    };
    pathHistory.unshift(historyEntry);
    updateHistoryTable();
    saveHistoryToLocalStorage();
}

// Function to save history to localStorage
function saveHistoryToLocalStorage() {
    localStorage.setItem('pathHistory', JSON.stringify(pathHistory));
}

// Function to load history from localStorage
function loadHistoryFromLocalStorage() {
    const saved = localStorage.getItem('pathHistory');
    if (saved) {
        pathHistory = JSON.parse(saved);
        pathHistory.forEach(entry => {
            entry.timestamp = new Date(entry.timestamp);
        });
        updateHistoryTable();
    }
}

// Function to remove entry from history
function removeFromHistory(id) {
    pathHistory = pathHistory.filter(entry => entry.id !== id);
    updateHistoryTable();
    saveHistoryToLocalStorage();
}

// Function to replay a path
function replayPath(id) {
    const entry = pathHistory.find(entry => entry.id === id);
    if (entry) {
        // Update select elements
        const startNode = document.getElementById('startNode');
        const endNode = document.getElementById('endNode');
        
        // Only update if the nodes exist in the current graph
        const startOption = Array.from(startNode.options).find(opt => opt.value === entry.start);
        const endOption = Array.from(endNode.options).find(opt => opt.value === entry.end);
        
        if (startOption && endOption) {
            startNode.value = entry.start;
            endNode.value = entry.end;
            
            // Highlight the path without adding to history
            highlightPath(entry.path);
        } else {
            alert(translations[currentLang].nodesNotAvailable || 'Some nodes from this path are no longer available in the graph.');
        }
    }
}

// Function to highlight path without adding to history
function highlightPath(path) {
    // Reset previous highlights
    d3.selectAll('.link').classed('highlighted', false);
    d3.selectAll('.node')
        .style('fill', d => d.color || nodeColors.default)
        .classed('highlighted', false);
    
    // Highlight the path
    let delay = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const pathLink = links.find(l => 
            (l.source.id === path[i] && l.target.id === path[i + 1]) ||
            (l.source.id === path[i + 1] && l.target.id === path[i])
        );
        
        if (pathLink) {
            setTimeout(() => {
                // Highlight edge
                d3.selectAll('.link')
                    .filter(d => 
                        (d.source.id === pathLink.source.id && d.target.id === pathLink.target.id) ||
                        (d.source.id === pathLink.target.id && d.target.id === pathLink.source.id)
                    )
                    .classed('highlighted', true)
                    .style('stroke', nodeColors.path);

                // Highlight nodes
                d3.selectAll('.node')
                    .filter(d => d.id === path[i] || d.id === path[i + 1])
                    .style('fill', nodeColors.path)
                    .classed('highlighted', true);
            }, delay);
        }
        delay += 500;
    }
}

// Update the history table function
function updateHistoryTable() {
    const tbody = document.getElementById('pathHistoryBody');
    tbody.innerHTML = '';

    if (pathHistory.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                        <i class="fas fa-history text-4xl mb-2 text-gray-400"></i>
                        <p>${translations[currentLang].noHistoryYet || 'No path history yet'}</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    pathHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        const formattedDistance = new Intl.NumberFormat(currentLang).format(entry.distance);
        const pathDisplay = entry.path.join(' → ');

        // Create cells for data
        const timestampCell = document.createElement('td');
        timestampCell.className = 'px-4 py-3 text-sm text-gray-500 whitespace-nowrap';
        timestampCell.textContent = formatTimestamp(entry.timestamp);

        const startCell = document.createElement('td');
        startCell.className = 'px-4 py-3 text-sm font-medium text-gray-900';
        startCell.textContent = entry.start;

        const endCell = document.createElement('td');
        endCell.className = 'px-4 py-3 text-sm font-medium text-gray-900';
        endCell.textContent = entry.end;

        const pathCell = document.createElement('td');
        pathCell.className = 'px-4 py-3 text-sm text-gray-500';
        pathCell.innerHTML = `
            <div class="max-w-xs overflow-hidden">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${pathDisplay}
                </span>
            </div>
        `;

        const distanceCell = document.createElement('td');
        distanceCell.className = 'px-4 py-3 text-sm text-gray-500 whitespace-nowrap';
        distanceCell.textContent = `${formattedDistance} ${translations[currentLang].distanceUnit}`;

        // Create actions cell with buttons
        const actionsCell = document.createElement('td');
        actionsCell.className = 'px-4 py-3 text-sm text-gray-500 flex justify-center gap-2';

        // Create replay button
        const replayButton = document.createElement('button');
        replayButton.className = 'text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-full hover:bg-indigo-50';
        replayButton.title = translations[currentLang].replayPath;
        replayButton.innerHTML = '<i class="fas fa-play"></i>';
        replayButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            replayPath(entry.id);
        });

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'text-red-600 hover:text-red-900 transition-colors p-1 rounded-full hover:bg-red-50';
        deleteButton.title = translations[currentLang].deletePath;
        deleteButton.innerHTML = '<i class="fas fa-times"></i>';
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFromHistory(entry.id);
        });

        // Append buttons to actions cell
        actionsCell.appendChild(replayButton);
        actionsCell.appendChild(deleteButton);

        // Append all cells to row
        row.appendChild(timestampCell);
        row.appendChild(startCell);
        row.appendChild(endCell);
        row.appendChild(pathCell);
        row.appendChild(distanceCell);
        row.appendChild(actionsCell);

        // Append row to tbody
        tbody.appendChild(row);
    });
}

// Update the PDF export function
function exportHistoryAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(translations[currentLang].pathHistory, 20, 20);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`${translations[currentLang].generatedOn}: ${formatTimestamp(new Date())}`, 20, 30);

    // Add table headers
    const headers = [
        translations[currentLang].timestamp,
        translations[currentLang].from,
        translations[currentLang].to,
        translations[currentLang].path,
        `${translations[currentLang].distance} (${translations[currentLang].distanceUnit})`
    ];
    
    let y = 40;
    doc.setFontSize(12);
    doc.setTextColor(100);
    headers.forEach((header, i) => {
        doc.text(header, 20 + (i * 35), y);
    });

    // Add table content
    doc.setTextColor(0);
    pathHistory.forEach((entry) => {
        y += 10;
        if (y > 280) { // Check if we need a new page
            doc.addPage();
            y = 20;
        }
        doc.text(formatTimestamp(entry.timestamp), 20, y);
        doc.text(entry.start, 55, y);
        doc.text(entry.end, 90, y);
        doc.text(entry.path.join(' → '), 125, y);
        doc.text(`${entry.distance}`, 160, y);
    });

    // Save the PDF
    doc.save('shortest-path-history.pdf');
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load history from localStorage
    loadHistoryFromLocalStorage();

    // Add clear history button handler
    document.getElementById('clearHistory').addEventListener('click', () => {
        if (confirm(translations[currentLang].confirmClearHistory || 'Are you sure you want to clear the history?')) {
            pathHistory = [];
            updateHistoryTable();
            saveHistoryToLocalStorage();
        }
    });

    // Add export PDF button handler
    document.getElementById('exportPDF').addEventListener('click', exportHistoryAsPDF);

    // Initialize language
    updateUILanguage();
}); 