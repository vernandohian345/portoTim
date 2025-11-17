// Process Data
        const processData = [
            {
                title: 'Konsultasi',
                icon: 'fas fa-comments',
                description: 'Kami mendengarkan kebutuhan dan tujuan bisnis Anda secara detail untuk memahami visi yang ingin diwujudkan.',
                time: '2-3 hari'
            },
            {
                title: 'Perencanaan',
                icon: 'fas fa-clipboard-list',
                description: 'Tim kami menyusun strategi, sitemap, dan blueprint yang detail sebagai fondasi proyek yang solid.',
                time: '3-5 hari'
            },
            {
                title: 'Desain',
                icon: 'fas fa-palette',
                description: 'Menciptakan mockup visual yang sesuai dengan brand identity dan ekspektasi Anda.',
                time: '5-7 hari'
            },
            {
                title: 'Pengembangan',
                icon: 'fas fa-code',
                description: 'Mengubah desain menjadi website yang fungsional, responsif, dan siap digunakan.',
                time: '10-14 hari'
            },
            {
                title: 'Revisi',
                icon: 'fas fa-sync-alt',
                description: 'Kami menyempurnakan setiap detail berdasarkan feedback Anda hingga hasilnya sempurna.',
                time: '2-4 hari'
            },
            {
                title: 'Launch',
                icon: 'fas fa-rocket',
                description: 'Website Anda diluncurkan dengan testing menyeluruh untuk memastikan performa optimal.',
                time: '1-2 hari'
            },
            {
                title: 'Maintenance',
                icon: 'fas fa-tools',
                description: 'Dukungan berkelanjutan untuk menjaga website Anda tetap up-to-date dan berjalan sempurna.',
                time: 'Berlangganan'
            }
        ];

        // Elements
        const nodes = document.querySelectorAll('.process-node');
        const centralHub = document.getElementById('centralHub');
        const detailPanel = document.getElementById('detailPanel');
        const detailClose = document.getElementById('detailClose');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const playBtn = document.getElementById('playBtn');
        const resetBtn = document.getElementById('resetBtn');
        const orbitContainer = document.getElementById('orbitContainer');

        // State
        let currentStep = 0;
        let isAutoPlaying = false;
        let autoPlayInterval = null;
        let isDetailOpen = false;

        // Initialize
        function init() {
            console.log('Initializing...');
            positionNodes();
            updateConnections();
            attachEventListeners();
            updateStats();
            updateActiveStep(0); // Set initial active step
        }

        // Position nodes in circle
        function positionNodes() {
            const radius = window.innerWidth > 768 ? 250 : 175;
            const centerX = orbitContainer.offsetWidth / 2;
            const centerY = orbitContainer.offsetHeight / 2;

            nodes.forEach((node, index) => {
                const angle = (index * 360 / 7) * (Math.PI / 180);
                const x = centerX + radius * Math.cos(angle - Math.PI / 2) - node.offsetWidth / 2;
                const y = centerY + radius * Math.sin(angle - Math.PI / 2) - node.offsetHeight / 2;
                
                node.style.left = `${x}px`;
                node.style.top = `${y}px`;
            });
        }

        // Update connection lines
        function updateConnections() {
            const centerX = orbitContainer.offsetWidth / 2;
            const centerY = orbitContainer.offsetHeight / 2;

            nodes.forEach((node, index) => {
                const line = document.getElementById(`line${index + 1}`);
                const nodeRect = node.getBoundingClientRect();
                const containerRect = orbitContainer.getBoundingClientRect();
                
                const nodeX = nodeRect.left - containerRect.left + nodeRect.width / 2;
                const nodeY = nodeRect.top - containerRect.top + nodeRect.height / 2;
                
                const distance = Math.sqrt(Math.pow(nodeX - centerX, 2) + Math.pow(nodeY - centerY, 2));
                const angle = Math.atan2(nodeY - centerY, nodeX - centerX) * (180 / Math.PI);
                
                line.style.width = `${distance}px`;
                line.style.left = `${centerX}px`;
                line.style.top = `${centerY}px`;
                line.style.transform = `rotate(${angle}deg)`;
            });
        }

        // Update active step
        function updateActiveStep(stepIndex) {
            // Remove active from all
            nodes.forEach(node => node.classList.remove('active'));
            document.querySelectorAll('.connection-line').forEach(line => line.classList.remove('active'));
            
            // Add active to current
            nodes[stepIndex].classList.add('active');
            document.getElementById(`line${stepIndex + 1}`).classList.add('active');
            
            // Update central hub
            const data = processData[stepIndex];
            centralHub.querySelector('.hub-title').textContent = data.title;
            centralHub.querySelector('.hub-description').textContent = data.description.substring(0, 50) + '...';
            centralHub.querySelector('.hub-icon').className = `${data.icon} hub-icon`;
            
            // Create particles
            createParticles(nodes[stepIndex]);
            
            // Update stats
            currentStep = stepIndex;
            updateStats();
        }

        // Create particle effects
        function createParticles(node) {
            const nodeRect = node.getBoundingClientRect();
            const containerRect = orbitContainer.getBoundingClientRect();
            
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${nodeRect.left - containerRect.left + nodeRect.width / 2}px`;
                particle.style.top = `${nodeRect.top - containerRect.top + nodeRect.height / 2}px`;
                particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);
                particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 80}px`);
                particle.style.animation = 'particle-float 1s ease-out forwards';
                particle.style.animationDelay = `${i * 0.05}s`;
                
                orbitContainer.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1000);
            }
        }

        // Show detail panel
        function showDetail(stepIndex) {
            const data = processData[stepIndex];
            
            document.getElementById('detailIcon').innerHTML = `<i class="${data.icon}"></i>`;
            document.getElementById('detailTitle').textContent = data.title;
            document.getElementById('detailDescription').textContent = data.description;
            document.getElementById('detailProgress').style.width = `${((stepIndex + 1) / 7) * 100}%`;
            document.getElementById('estimateTime').textContent = data.time;
            
            detailPanel.classList.add('active');
            isDetailOpen = true;
        }

        // Update stats display
        function updateStats() {
            document.getElementById('activeStep').textContent = currentStep + 1;
            document.getElementById('progressPercent').textContent = `${Math.round(((currentStep + 1) / 7) * 100)}%`;
        }

        // Auto play
        function startAutoPlay() {
            isAutoPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            
            autoPlayInterval = setInterval(() => {
                const nextStep = (currentStep + 1) % 7;
                updateActiveStep(nextStep);
            }, 2500);
        }

        function stopAutoPlay() {
            isAutoPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        // Event listeners
        function attachEventListeners() {
            // Node clicks
            nodes.forEach((node, index) => {
                node.addEventListener('click', () => {
                    updateActiveStep(index);
                    showDetail(index);
                });
            });

            // Central hub click
            centralHub.addEventListener('click', () => {
                showDetail(currentStep);
            });

            // Detail panel close
            detailClose.addEventListener('click', () => {
                detailPanel.classList.remove('active');
                isDetailOpen = false;
            });

            // Control buttons
            prevBtn.addEventListener('click', () => {
                const prevStep = currentStep > 0 ? currentStep - 1 : 6;
                updateActiveStep(prevStep);
            });

            nextBtn.addEventListener('click', () => {
                const nextStep = (currentStep + 1) % 7;
                updateActiveStep(nextStep);
            });

            playBtn.addEventListener('click', () => {
                if (isAutoPlaying) {
                    stopAutoPlay();
                } else {
                    startAutoPlay();
                }
            });

            resetBtn.addEventListener('click', () => {
                stopAutoPlay();
                updateActiveStep(0);
                detailPanel.classList.remove('active');
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowLeft':
                        const prevStep = currentStep > 0 ? currentStep - 1 : 6;
                        updateActiveStep(prevStep);
                        break;
                    case 'ArrowRight':
                        const nextStep = (currentStep + 1) % 7;
                        updateActiveStep(nextStep);
                        break;
                    case ' ':
                        e.preventDefault();
                        if (isAutoPlaying) {
                            stopAutoPlay();
                        } else {
                            startAutoPlay();
                        }
                        break;
                    case 'Escape':
                        detailPanel.classList.remove('active');
                        isDetailOpen = false;
                        break;
                }
            });

            // Window resize
            window.addEventListener('resize', () => {
                positionNodes();
                updateConnections();
            });
        }

        // Initialize on load
        window.addEventListener('load', init);
        
        // Also initialize on DOM content loaded as backup
        document.addEventListener('DOMContentLoaded', init);