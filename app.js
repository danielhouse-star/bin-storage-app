import { openDB } from './idb.js'; // Add idb.js to your folder

const dbPromise = openDB('BinStorageDB', 1, {
    upgrade(db) {
        const store = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        store.createIndex('description', 'description');
        // Store for tracking next bin/shelf
        const configStore = db.createObjectStore('config', { keyPath: 'key' });
        configStore.put({ key: 'nextBin', value: 100 }); // Starts at B100
        configStore.put({ key: 'nextShelf', value: 100 }); // S100
    }
});

async function getNextNumber(type) {
    const db = await dbPromise;
    const tx = db.transaction('config', 'readwrite');
    const store = tx.objectStore('config');
    const config = await store.get(`next${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const num = config.value;
    await store.put({ key: config.key, value: num + 1 });
    return num;
}

async function addItem() {
    const desc = document.getElementById('description').value.trim();
    if (!desc) return alert('Enter a description');
    
    const binNum = await getNextNumber('bin');
    const shelfNum = await getNextNumber('shelf');
    const item = { description: desc, bin: `B${binNum}`, shelf: `S${shelfNum}` };
    
    const db = await dbPromise;
    const tx = db.transaction('items', 'readwrite');
    tx.objectStore('items').add(item);
    await tx.done;
    
    alert('Item added!');
    document.getElementById('description').value = '';
}

async function searchItems() {
    const keyword = document.getElementById('keyword').value.trim().toLowerCase();
    if (!keyword) return;
    
    const db = await dbPromise;
    const items = await db.getAll('items');
    const matches = items.filter(item => item.description.toLowerCase().includes(keyword));
    
    const results = document.getElementById('results');
    results.innerHTML = '';
    matches.forEach(match => {
        const li = document.createElement('li');
        li.textContent = `${match.description} - Bin: ${match.bin}, Shelf: ${match.shelf}`;
        results.appendChild(li);
    });
}