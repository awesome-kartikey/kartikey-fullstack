const loadBtn = document.getElementById('load-btn');
const clearBtn = document.getElementById('clear-btn');
const output = document.getElementById('output');

loadBtn.addEventListener('click', async () => {
    output.textContent = 'Loading...';


    const failParam = window.location.search.includes('fail=1') ? '?fail=1' : '';



    try {
        const response = await fetch(`/api/profile${failParam}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch profile. Response status: ${response.status}`);
        }

        const data = await response.json();

        const trace = response.headers.get('X-Debug-Trace');

        output.innerHTML = `
            <h2>${data.name}</h2>
            <p>Email: ${data.email}</p>
            <p>Trace: ${trace || 'No trace'}</p>
        `;
        // throw new Error('Simulated runtime error');
        localStorage.setItem('lastProfileFetch', JSON.stringify(data) + new Date().toISOString());

        console.log('Profile loaded:', data);
        console.log('Fetch time saved to localStorage');

    } catch (error) {
        output.textContent = `Error: ${error.message}`;
        console.error('Error loading profile:', error);
    }
});

clearBtn.addEventListener('click', () => {
    output.textContent = '';
    localStorage.removeItem('lastProfileFetch');
    console.log('Profile cleared');
});